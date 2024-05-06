<template>
  <div class="view-wrapper">
    <h1>SignalProtocolDemo</h1>
  </div>
</template>

<script lang="ts" setup>
import {PublicKey, Fingerprint, IdentityKeyPair} from '@signalapp/libsignal-client';

const ourKeyObj = PublicKey.deserialize(Buffer.from(""));
</script>

<style lang="scss" scoped>

</style>
