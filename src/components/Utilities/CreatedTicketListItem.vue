<template>
    <div class="list-group-item">
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
  export default {
    props: [
      'ticket'
    ]
  }
</script>
