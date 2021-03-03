import Vue from 'vue'
import Vuex from 'vuex'
import { vuexfireMutations, firestoreAction } from 'vuexfire'
import { dbProducts, dbCategories, db } from "../firebase/config"
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isLogin:false,
    products:[],
    categories:[],
    cart:[], /* used in home*/
  },
  mutations: {
    ...vuexfireMutations,
    setIsLogin(state, payload){
      state.isLogin = payload;
    },
    // cart mutation
    setCart(state, payload){
      state.cart = payload;
    },
    addCartItem(state, payload){
      state.cart.push(payload);
    },
    removeCartItem(state, payload){
      const i = state.cart.findIndex(item=> item.id === payload.id );
      state.cart.splice(i,1);
    },
    updateCartItem(state, payload){
      const i = state.cart.findIndex(item=> item.id === payload.id );
      state.cart.splice(i,1,payload);
    },
    // end cart mutation
  },
  actions: {
    // products actions
    bindProducts: firestoreAction(({ bindFirestoreRef }) => {
      return bindFirestoreRef('products', dbProducts.orderBy("createAt","desc"));
    }),

    addProduct: firestoreAction((context, product) => {
      console.log("action addProduct fired");
      return dbProducts.add(product)
    }),

    updateProduct: firestoreAction((context, payload) => {
      delete payload.product.qty;
      return dbProducts.doc(payload.id).update(payload.product)
    }),

    batchUpdateProduct: firestoreAction((context, payloads) => {
      const batch = db.batch();

      payloads.forEach(payload=>{
        const ref = dbProducts.doc(payload.id);
        batch.update(ref, payload.product);
      })

      return batch.commit();
    }),

    deleteProduct: firestoreAction((context, id) => {
      return dbProducts.doc(id).delete()
    }),
    checkOut({state, dispatch}){   
      const products = [];

      state.cart.forEach(item => {
        const oldProduct = state.products.find(product => product.id === item.id);
        const {id, ...product} = item;
        product.qty_product = oldProduct.qty_product - product.qty;
      
        products.push({id, product});
      })

      return dispatch("batchUpdateProduct", products);
    },
    // end products action
    // categories action
    bindCategories: firestoreAction(({ bindFirestoreRef }) => {
      return bindFirestoreRef('categories', dbCategories);
    }),

    addCategory: firestoreAction((context, category) => {
      return dbCategories.add({name:category})
    }),

    updateCategory: firestoreAction((context, payload) => {
      return dbCategories.doc(payload.id).update({name:payload.name});
    }),

    deleteCategory: firestoreAction((context, id) => {
      return dbCategories.doc(id).delete()
    }),
    // end categories action
  },
  modules: {
  }
})
