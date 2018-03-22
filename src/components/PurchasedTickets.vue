<template>
  <span>
      <div class="container">
          <div class="jumbotron" v-if="Purchases.length <= 0">
              <h1 class="display-4">
                No Purchases...
              </h1>
              <p class="lead">
                  Hmmm.. seems albit...empty in here
              </p>
              <hr/>
              <p>When you purchase a ticket or a voucher it will show up here</p>
          </div>
          <span v-else>
            <p>Purchases: {{PurchaseCount}}</p>
            <hr/>
            <div class="list-group">
                <button class="list-group-item list-group-item-action" v-for="purchase in Purchases" :key="purchase._id" v-on:click="showqr(purchase._id)">
                  <h5>{{purchase.ticketId.title}}</h5>
                  <dl class="dl-horizontal">
                      <dt>Event</dt>
                      <dd>{{purchase.eventId.title}}</dd>
                      <dt>Quantity</dt>
                      <dd>{{purchase.resolved_qty}}</dd>
                  </dl>
                </button>
            </div>
          </span>
      </div>

      <div class="modal fade" tabindex="-1" role="dialog" id="qrcodebox">
          <div class="modal-dialog" role="document">
              <div class="modal-content">
                <span v-if="!PO">
                  <div class="modal-header">
                      <h5 class="modal-title"></h5>
                  </div>
                  <div class="modal-body">

                  </div>
                </span>
                  <span v-else>
                    <div class="modal-header">
                        <h5 class="modal-title">{{PO.ticketId.title}}</h5>
                    </div>
                    <div class="modal-body text-center">
                      <vqr :config="qrconfig" ></vqr>
                    </div>
                  </span>
              </div>
          </div>
      </div>
  </span>
</template>

<style>

</style>

<script>
import $ from 'jquery'
import vqr from 'vue-qart'
export default {
  components: {
    vqr
  },
  data: function () {
    return {
      openedTicket: null,
      Purchases: this.$store.getters.Purchases
    }
  },
  computed: {
    PurchaseCount: function () {
      return this.Purchases.length
    },
    PO: function () {
      if (this.openedTicket) {
        return this.Purchases.find((element) => {
          if (element._id == this.openedTicket) {
            return true
          }
        })
      }
      return false
    },
    qrconfig: function () {
      if (!this.PO) {
        return {
          value: 'notSet',
          imagePath: './e-mobie_default.png',
          filter: 'color'
        }
      } else {
        return {
          size: 800,
          value: this.openedTicket,
          imagePath: './e-mobie_default.png',
          filter: 'color'
        }
      }
    }
  },
  methods: {
    showqr: function (purchaseOrderId) {
      this.openedTicket = purchaseOrderId
      $('#qrcodebox').modal('show')
    }
  }

}
</script>
