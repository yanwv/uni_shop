<template>
  <view class="cart-container" v-if="cart.length !== 0">
    <!-- 地址组件 -->
    <my-address></my-address>
    <!-- 商品列表标题 -->
    <view class="cart-title">
      <!-- 左 -->
      <uni-icons type="shop" size="18"></uni-icons>
      <!-- 右 -->
      <text class="cart-title-text">购物车</text>
    </view>
    <!-- 循环渲染购物车数据 -->
    <uni-swipe-action>
      <block v-for="(goods, i) in cart" :key="i">
        <uni-swipe-action-item :right-options="options" @click="swipeActionClickHandler(goods)">
          <my-goods :goods="goods" :show-radio="true" :show-num="true" @radio-change="radioChangeHandler"
            @num-change="numberChangeHandler"></my-goods>
        </uni-swipe-action-item>
      </block>
    </uni-swipe-action>
    <!-- 自定义结算组件 -->
    <my-settle></my-settle>
  </view>
  <!-- 空白购物车区域 -->
  <view class="empty-cart" v-else>
    <image src="/static/cart_empty@2x.png" class="empty-img"></image>
    <text class="tip-text">空空如也~</text>
  </view>
</template>

<script>
  import badgeMix from '../../mixins/tabbar-badge.js'
  import {
    mapState,
    mapMutations
  } from "vuex"

  export default {
    mixins: [badgeMix],
    computed: {
      ...mapState('m_cart', ['cart'])
    },
    data() {
      return {
        options: [{
          text: '删除', // 显示的文本内容
          style: {
            backgroundColor: '#C00000' // 按钮的背景颜色
          }
        }]
      }
    },
    methods: {
      ...mapMutations('m_cart', ['updateGoodsState', 'updateGoodsCount', 'removeGoodsById']),
      radioChangeHandler(e) {
        // 监听到 radio-change 事件后通过 this 调用 cart.js 中 mapMutations 映射过来的 updateGoodsState 方法
        this.updateGoodsState(e)
      },
      // 商品的数量发生了变化
      numberChangeHandler(e) {
        this.updateGoodsCount(e)
      },
      // 点击了滑动操作按钮
      swipeActionClickHandler(goods) {
        this.removeGoodsById(goods.goods_id)
      }
    }
  }
</script>

<style lang="scss">
  .cart-title {
    height: 40px;
    display: flex;
    align-items: center;
    font-size: 14px;
    padding-left: 5px;
    border-bottom: 1px solid #cacaca;

    .cart-title-text {
      margin-left: 10px;
    }
  }

  .cart-container {
    padding-bottom: 50px;
  }

  .empty-cart {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 150px;

    .empty-img {
      width: 90px;
      height: 90px;
    }

    .tip-text {
      font-size: 12px;
      color: gray;
      margin-top: 15px;
    }
  }
</style>
