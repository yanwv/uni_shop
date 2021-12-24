export default {
  namespaced: true,

  mutations: {
    // 添加商品到购物车
    addToCart(state, goods) {
      const findResult = state.cart.find(x => x.goods_id === goods.goods_id)
      if (!findResult) {
        state.cart.push(goods) // 购物车没有这个商品 push进购物车
      } else {
        findResult.goods_count++
      }
      this.commit('m_cart/saveToStorgate') // 持久化存储到本地
    },
    saveToStorgate(state) {
      uni.setStorageSync('cart', JSON.stringify(state.cart))
    },
    // 更新购物车勾选状态
    updateGoodsState(state, goods) {
      const findResult = state.cart.find(x => x.goods_id === goods.goods_id)
      if (findResult) { // 如果有对应的商品信息对象
        findResult.goods_state = goods.goods_state // 更新对应商品的勾选状态
        this.commit('m_cart/saveToStorgate') // 持久化存储到本地
      }
    },
    updateGoodsCount(state, goods) {
      const findResult = state.cart.find(x => x.goods_id === goods.goods_id)
      if (findResult) {
        findResult.goods_count = goods.goods_count // 更新对应商品的数量
        this.commit('m_cart/saveToStorgate') // 持久化存储到本地
      }
    },
    // 根据 Id 从购物车中删除对应的商品信息
    removeGoodsById(state, goods_id) {
      state.cart = state.cart.filter(x => x.goods_id !== goods_id) // 调用数组的 filter 方法进行过滤
      this.commit('m_cart/saveToStorgate') // 持久化存储到本地
    },
    // 更新购物车商品勾选状态
    updateAllGoodsState(state, newState) {
      state.cart.forEach(x => x.goods_state = newState)
      this.commit('m_cart/saveToStorgate') // 持久化存储到本地
    }
  },

  state: () => ({
    // 购物车的数组，用来存储购物车中每个商品的信息对象
    // 每个商品的信息对象，都包含如下 6 个属性：
    // { goods_id, goods_name, goods_price, goods_count, goods_small_logo, goods_state }
    cart: JSON.parse(uni.getStorageSync('cart') || '[]')
  }),

  getters: {
    // 购物车所有商品
    total(state) {
      // let c = 0
      // state.cart.forEach(x => c += x.goods_count)
      // return c
      return state.cart.reduce((total, item) => total += item.goods_count, 0)
    },
    // 购物车已勾选商品
    checkedCount(state) {
      // 先使用 filter 方法，从购物车中过滤器已勾选的商品
      // 再使用 reduce 方法，将已勾选的商品总数量进行累加
      // reduce() 的返回值就是已勾选的商品的总数量
      return state.cart.filter(x => x.goods_state).reduce((total, item) => total += item.goods_count, 0)
    },
    // 已勾选的商品的总价
    checkedGoodsAmount(state) {
      // 先使用 filter 方法，从购物车中过滤器已勾选的商品
      // 再使用 reduce 方法，将已勾选的商品数量 * 单价之后，进行累加
      // reduce() 的返回值就是已勾选的商品的总价
      // 最后调用 toFixed(2) 方法，保留两位小数
      return state.cart.filter(x => x.goods_state)
        .reduce((total, item) => total += item.goods_count * item.goods_price, 0)
        .toFixed(2)
    }
  },

}
