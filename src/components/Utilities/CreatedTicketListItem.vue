<template>
<div class="list-group-item">
  <button class="btn btn-danger btn-sm" @click="deleteTicket">Delete</button>
  <dl class="horizontal">
    <dt>Title</dt>
    <dd>{{ticket.title}}</dd>
    <dt>Paid Or Free</dt>
    <dd>{{ticket.paid_or_free}}</dd>
    <dt>Qty Avaiable</dt>
    <dd>{{ticket.quantity_available}}</dd>
    <dt>Description</dt>
    <dd>{{ticket.description}}</dd>
  </dl>
</div>
</template>

<style>

</style>

<script>
import swal from 'sweetalert2'
export default {
  props: [
    'ticket'
  ],
  methods: {
    deleteTicket() {
      this.$store.dispatch('DeleteEventTicket', this.ticket).then((response) => {
        if (response.status == 200) {
          if (response.data.success) {
            this.$store.dispatch('DropEventTicket', this.ticket).then((response) => {
              if (response.success) {
                swal({
                  title: "Ticket Deleted",
                  type: "success"
                })
              }
            })
          }
        }
      })
    }
  }
}
</script>
