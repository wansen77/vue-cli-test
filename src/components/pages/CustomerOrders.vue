<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <div class="row mt-4">
      <div class="col-md-4 mb-4" v-for="item in products" :key="item.id">
        <div class="card border-0 shadow-sm">
          <div
            style="height: 150px; background-size: cover; background-position: center"
            :style="{backgroundImage:`url(${item.imageUrl})`}"
          ></div>
          <div class="card-body">
            <span class="badge badge-secondary float-right ml-2">{{item.category}}</span>
            <h5 class="card-title">
              <a href="#" class="text-dark" @click="getProduct(item.id)">{{item.title}}</a>
            </h5>
            <p class="card-text">{{item.content}}</p>
            <div class="d-flex justify-content-between align-items-baseline">
              <div class="h5" v-if="!item.price">{{item.origin_price}}</div>
              <del class="h6" v-if="item.price">{{item.origin_price}}</del>
              <div class="h5" v-if="item.price">{{item.price}}</div>
            </div>
          </div>
          <div class="card-footer d-flex">
            <button
              type="button"
              class="btn btn-outline-secondary btn-sm"
              @click="getProduct(item.id)"
            >
              <i class="fas fa-spinner fa-spin" v-if="status.loadingItem===item.id"></i>
              查看更多
            </button>
            <button
              type="button"
              class="btn btn-outline-danger btn-sm ml-auto"
              @click="addtoCart(item.id)"
            >
              <i class="fas fa-spinner fa-spin" v-if="status.loadingItem===item.id"></i>
              加到購物車
            </button>
          </div>
        </div>
      </div>
    </div>

    <!--查看更多 modal -->
    <div
      class="modal fade"
      id="productModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">{{product.title}}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <img :src="product.imageUrl" class="img-fluid" alt />
            <blockquote class="blockquote mt-3">
              <p class="mb-0">{{product.content}}</p>
              <footer class="blockquoter-footer text-right">{{product.description}}</footer>
            </blockquote>

            <div class="d-flex justify-content-between align-items-baseline">
              <div class="h4" v-if="!product.price">{{product.origin_price}}元</div>
              <del class="h6" v-if="product.price">原價{{product.origin_price}}元</del>
              <div class="h5" v-if="product.price">現在只要{{product.price}}元</div>
            </div>
            <select name class="form-control mt-3" v-model="product.num">
              <option :value="num" v-for="num in 10" :key="num">選購{{num}}{{product.unit}}</option>
            </select>
          </div>
          <div class="modal-footer bg-dark">
            <div class="text-muted text-nowrap mr-3">
              小計
              <strong>{{product.num*product.price}}</strong>元
            </div>
            <button
              type="button"
              class="btn btn-primary"
              @click="addtoCart(product.id,product.num)"
            >
              <i class="fas fa-spinner fa-spin" v-if="status.loadingItem===product.id"></i>
              加到購物車
            </button>
          </div>
        </div>
      </div>
    </div>
    <!--查看更多 modal -->

    <!-- 購物車列表 -->
    <table class="table mt-4">
      <thead>
        <tr>
          <th>產品名稱</th>
          <th width="120">數量</th>
          <th width="120">單價</th>
          <th width="100">總計</th>
          <th width="120">操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in carts" :key="item.id">
          <td>{{item.product.title}}</td>
          <td>{{item.qty}}</td>
          <td class="text-right">{{item.product.price|currency}}</td>
          <td class="text-right">{{item.total|currency}}</td>
          <td>
            <button class="btn btn-outline-primary btn-sm" @click="delCart(item.id)">
              <i class="fas fa-trash-alt"></i>
            </button>
          </td>
        </tr>
        <tr>
          <td></td>
          <td></td>
          <td class="text-right">購買總金額:</td>
          <td class="text-right">{{total|currency}}</td>
        </tr>
        <tr v-if="!total==finalTotal">
          <td></td>
          <td></td>
          <td class="text-right text-danger">折扣價:</td>
          <td class="text-right">{{finalTotal|currency}}</td>
        </tr>
      </tbody>
    </table>
    <div class="input-group input-group-sm">
      <input type="text" placeholder="請輸入優惠碼" v-model="coupon_code" />
      <div class="input-group-appened">
        <button type="button" class="btn btn-outline-primary btn-sm" @click="addCoupon">套用優惠碼</button>
      </div>
    </div>
    <!-- 購物車列表 -->

    <!-- 建立訂單 -->
    <div class="my-5 row justify-content-center">
      <form class="col-md-6" @submit.prevent="createOrder">
        <div class="form-group">
          <label for="useremail">Email</label>
          <input
            type="email"
            class="form-control"
            name="email"
            id="useremail"
            v-model="form.user.email"
            placeholder="請輸入 Email"
            v-validate="'required|email'"
            :class="{'is-invalid':errors.has('email')}"
          />
          <span class="text-danger" v-if="errors.has('email')">{{errors.first('email')}}</span>
        </div>

        <div class="form-group">
          <label for="username">收件人姓名</label>
          <input
            type="text"
            class="form-control"
            name="name"
            id="username"
            v-model="form.user.name"
            placeholder="輸入姓名"
            v-validate="'required'"
            :class="{'is-invalid':errors.has('name')}"
          />
          <span class="text-danger" v-if="errors.has('name')">請輸入姓名</span>
        </div>

        <div class="form-group">
          <label for="usertel">收件人電話</label>
          <input
            type="tel"
            class="form-control"
            name="tel"
            id="usertel"
            v-model="form.user.tel"
            placeholder="請輸入電話"
            v-validate="'required'"
            :class="{'is-invalid':errors.has('tel')}"
          />
          <span class="text-danger" v-if="errors.has('tel')">請輸入電話</span>
        </div>

        <div class="form-group">
          <label for="useraddress">收件人地址</label>
          <input
            type="text"
            class="form-control"
            name="address"
            id="useraddress"
            v-model="form.user.address"
            placeholder="請輸入地址"
            v-validate="'required'"
            :class="{'is-invalid':errors.has('address')}"
          />
          <span class="text-danger" v-if="errors.has('address')">地址欄位不得留空</span>
        </div>

        <div class="form-group">
          <label for="comment">留言</label>
          <textarea
            name
            id="comment"
            class="form-control"
            cols="30"
            rows="10"
            v-model="form.message"
          ></textarea>
        </div>
        <div class="text-right">
          <button class="btn btn-danger">送出訂單</button>
        </div>
      </form>
    </div>
    <!-- 建立訂單 -->
  </div>
</template>

<script>
import $ from "jquery";

export default {
  data() {
    return {
      products: [],
      product: {},
      carts: [],
      total: "",
      finalTotal: "",
      coupon_code: "",
      isLoading: false,
      status: { loadingItem: "" },
      form: {
        user: {
          name: "",
          email: "",
          tel: "",
          address: ""
        },
        message: ""
      }
    };
  },
  methods: {
    getProducts() {
      const api = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/products`;
      const vm = this;
      vm.isLoading = true;
      this.$http.get(api).then(response => {
        console.log(response.data);
        vm.isLoading = false;
        vm.products = response.data.products;
      });
    },
    getProduct(id) {
      const url = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/product/${id}`;
      const vm = this;
      vm.status.loadingItem = id;
      this.$http.get(url).then(response => {
        console.log(response.data);
        vm.product = response.data.product;
        $("#productModal").modal("show");
        vm.status.loadingItem = "";
      });
    },
    addtoCart(id, qty = 1) {
      const url = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/cart`;
      const vm = this;
      const cart = {
        product_id: id,
        qty
      };
      vm.status.loadingItem = id;
      this.$http.post(url, { data: cart }).then(response => {
        console.log(response.data);
        vm.status.loadingItem = "";
        vm.getCart();
        $("#productModal").modal("hide");
      });
    },
    getCart() {
      const url = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/cart`;
      const vm = this;
      vm.isLoading = true;
      this.$http.get(url).then(response => {
        console.log(response.data);
        vm.carts = response.data.data.carts;
        vm.total = response.data.data.total;
        vm.finalTotal = response.data.data.final_total;
        vm.isLoading = false;
      });
    },
    delCart(id) {
      const url = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/cart/${id}`;
      const vm = this;
      vm.isLoading = true;
      this.$http.delete(url).then(response => {
        console.log(response.data);
        vm.getCart();
        vm.isLoading = false;
      });
    },
    addCoupon() {
      const url = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/coupon`;
      const vm = this;
      const coupon = {
        code: vm.coupon_code
      };
      vm.isLoading = true;
      this.$http.post(url, { data: coupon }).then(response => {
        console.log(response.data);
        vm.getCart();
        vm.isLoading = false;
      });
    },
    createOrder() {
      const url = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/order`;
      const vm = this;
      const order = vm.form;
      this.$validator.validate().then(result => {
        if (result) {
          vm.isLoading = true;
          this.$http.post(url, { data: order }).then(response => {
            console.log("訂單已建立", response.data);
            if (response.data.success) {
              vm.$router.push(`/customer_checkout/${response.data.orderId}`);
            }
            vm.isLoading = false;
          });
        } else {
          console.log("欄位不完整");
        }
      });
    }
  },
  created() {
    this.getProducts();
    this.getCart();
  }
};
</script>