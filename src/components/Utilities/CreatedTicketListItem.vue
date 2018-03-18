<template>
    <div class="list-group-item">
      <dl>
          <dt>Title</dt>
          <dd>{{ticket.title}}</dd>
          <dt>Paid Or Free</dt>
          <dd>{{ticket.paid_or_free}}</dd>
          <dt>Qty Avaiable</dt>
          <dd>{{ticket.quantity}}</dd>
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
