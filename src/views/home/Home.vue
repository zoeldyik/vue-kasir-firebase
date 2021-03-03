<template>
  <div class="home custom-container py-3">
    <div class="columns m-0">
      <!-- content column -->
      <div class="column is-8">
        <!-- display it when cart is empty -->
        <div
          class="empty-cart has-text-centered is-flex is-justify-content-center is-align-items-center"
          v-if="!cart.length"
        >
          <b-icon icon="cart" size="is-large"></b-icon>
          <p class="is-size-3">CART IS EMPTY</p>
        </div>
        <!-- ----------------------------- -->

        <!-- search input -->
        <b-field
          label="Search By Name ..."
          label-position="on-border"
          v-if="cart.length"
        >
          <b-input
            v-model="search"
            placeholder="Search..."
            type="input"
            icon-right="close"
            icon-right-clickable
            @icon-right-click="search = ''"
          ></b-input>
        </b-field>
        <!-- end search input -->

        <!-- cart item -->
        <b-table
          :data="displayCart"
          paginated
          :per-page="pagination.perPage"
          :current-page.sync="pagination.currentPage"
          pagination-size="is-small"
          v-if="cart.length"
        >
          <!-- action column -->
          <b-table-column label="ACTION" centered v-slot="props">
            <div class="buttons is-centered">
              <b-button
                type="is-info"
                size="is-small"
                icon-left="update"
                rounded
                @click="editCartItem(props.row.id)"
              >
                EDIT
              </b-button>
              <b-button
                type="is-dark"
                size="is-small"
                icon-left="minus"
                rounded
                @click="removeCartItem(props.row)"
              >
                DEL
              </b-button>
            </div>
          </b-table-column>
          <!-- end action column -->

          <b-table-column label="PRODUCT" v-slot="props">
            {{ props.row.name.toUpperCase() }}
          </b-table-column>
          <b-table-column label="QTY" numeric width="10" v-slot="props">
            {{ props.row.qty }}
          </b-table-column>
          <b-table-column label="PRICE" numeric v-slot="props">
            {{ props.row.price }}
          </b-table-column>
          <b-table-column label="SUBTOTAL" numeric v-slot="props">
            {{ props.row.total }}
          </b-table-column>

          <template #footer>
            <div
              class="has-text-right is-size-5 is-flex is-justify-content-space-between"
            >
              <span class="ml-6">
                TOTAL
              </span>
              <span class="">
                {{ totalPrice }}
              </span>
            </div>
          </template>
        </b-table>
        <!-- end cart item -->

        <!-- buttons -->
        <div class="is-flex is-justify-content-flex-end">
          <div class="buttons mt-4" v-if="cart.length">
            <b-button
              size="is-small"
              type="is-info"
              rounded
              icon-left="check"
              @click="checkOut"
              :disabled="isDisabled"
            >
              CHECK OUT
            </b-button>
            <b-button
              size="is-small"
              type="is-dark"
              rounded
              icon-left="broom"
              @click="clearCart"
              :disabled="isDisabled"
            >
              CLEAR
            </b-button>
          </div>
        </div>

        <!-- end buttons -->
      </div>
      <!-- end content column -->

      <!-- form column -->
      <div class="column is-3 is-offset-1">
        <form-home></form-home>
      </div>
      <!-- end form column -->
    </div>
  </div>
</template>

<script>
import formHome from "./form-home";
import { Bus } from "../../bus";
import printJS from "print-js";

export default {
  name: "home",
  components: {
    "form-home": formHome,
  },
  data() {
    return {
      search: "",
      pagination: {
        currentPage: 1,
        perPage: 8,
      },
      isDisabled: false,
    };
  },
  computed: {
    cart() {
      return this.$store.state.cart;
    },
    displayCart() {
      const result = this.$store.state.cart.filter((el) =>
        el.name.includes(this.search)
      );

      return result.map((el) => {
        return {
          qty_product: el.qty_product,
          price: el.price.toLocaleString("id"),
          name: el.name,
          category: el.category,
          createAt: el.createAt,
          qty: el.qty,
          total: el.total.toLocaleString("id"),
          id: el.id,
        };
      });
    },
    totalPrice() {
      if (!this.cart.length) return 0;
      const total = this.cart.reduce((acc, cur) => acc + cur.total, 0);
      return total.toLocaleString("id");
    },
    totalProducts() {
      return this.displayCart.length;
    },
  },
  methods: {
    removeCartItem(item) {
      this.$store.commit("removeCartItem", item);
    },
    editCartItem(id) {
      const item = this.cart.filter((item) => item.id === id);
      const [payload] = item;
      Bus.$emit("edit-cart-item", payload);
    },
    clearCart() {
      this.$store.commit("setCart", []);
    },
    batchUpdateProduct() {
      this.isDisabled = true;

      this.$store
        .dispatch("checkOut")
        .then(() => {
          console.log("product berhasil di update");
          this.clearCart();
        })
        .catch((err) => {
          console.log("gagal checkout");
          console.log(err);
        })
        .finally(() => {
          this.isDisabled = false;
        });
    },
    checkOut() {
      this.$buefy.dialog.confirm({
        message:
          "<p class='is-size-6 has-text-weight-semi-bold'>Want to print bill ?</p>",
        type: "is-info",
        size: "is-small",
        confirmText: "YES",
        cancelText: "NO",
        onConfirm: () => {
          this.print();
          this.batchUpdateProduct();
        },
        onCancel: () => {
          this.batchUpdateProduct();
        },
      });
    },
    print() {
      printJS({
        printable: [
          ...this.displayCart,
          { name: "TOTAL", price: "", qty: "", total: this.totalPrice },
        ],
        type: "json",
        properties: ["name", "price", "qty", "total"],
        header: `<h3 class="header">WARUNGKU</h3>`,
        style: ".header{text-align:center;}",
        gridHeaderStyle:
          "text-align:left; padding-bottom:6px; border-bottom:1px solid black;",
        gridStyle: "border-bottom:1px solid rgba(0,0,0,0.4);",
        maxWidth: "300",
      });
    },
  },
  watch: {
    cart() {
      localStorage.setItem("cart", JSON.stringify(this.cart));
    },
  },
  mounted() {
    // cek localstorage
    let cart = localStorage.getItem("cart");
    if (cart) {
      if (cart.length) {
        cart = JSON.parse(cart);
        this.$store.commit("setCart", cart);
      }
    }
  },
};
</script>

<style scoped>
.empty-cart {
  min-height: 300px;
}

.home >>> .pagination-link {
  background-color: white !important;
}

.home >>> .pagination-link:focus {
  border-color: white !important;
}

.home >>> .is-current {
  background-color: #167df0 !important;
  border-color: #167df0 !important;
}

.home >>> .input:focus {
  border-color: #167df0;
}
</style>
