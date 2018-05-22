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
              <router-link v-for="purchase in Purchases" :key="purchase._id" :to="{ name: 'FindInvoice', params: { invoiceId: purchase._id} }"
              class="list-group-item list-group-item-action"
              >
                <h5 v-if="purchase.ticketId != null">{{purchase.ticketId.title}}</h5>
                <h5 v-else>N/A</h5>
                <dl class="dl-horizontal">
                    <dt>Event</dt>
                    <dd v-if="purchase.eventId != null">{{purchase.eventId.title}}</dd>
                    <dd v-else>N/A</dd>
                </dl>
              </router-link>
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
                        <h5 class="modal-title" v-if="PO.ticketId != null">{{PO.ticketId.title}}</h5>
                        <h5 v-else>N/A</h5>
                    </div>
                    <div class="modal-body text-center">
                      <vqr :code="qrconfig.value"></vqr>
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
import vqr from '../../Utilities/qrcodeGen.vue'
export default {
  components: {
    vqr
  },
  data: function() {
    return {
      openedTicket: null,
      Purchases: this.$store.state.user.Invoices
    }
  },
  computed: {
    PurchaseCount: function() {
      return this.Purchases.length
    },
    PO: function() {
      if (this.openedTicket) {
        return this.Purchases.find((element) => {
          if (element._id == this.openedTicket) {
            return true
          }
        })
      }
      return false
    },
    qrconfig: function() {
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
    showqr: function(purchaseOrderId) {
      this.openedTicket = purchaseOrderId
      $('#qrcodebox').modal('show')
    }
  }

}
</script>
