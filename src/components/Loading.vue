<script setup lang="ts"></script>

<template>
  <div class="loading">
    <div class="inner">
      <div class="line"></div>
      <div class="line"></div>
      <div class="line"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.loading {
  background: #fff;
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  text-align: center;

  .inner {
    display: inline-block;
    vertical-align: middle;
  }

  .line {
    display: inline-block;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    margin: 0 5px;

    &:nth-child(odd) {
      background-color: #4689bd;
    }

    &:nth-child(2n) {
      background-color: #135383;
    }
  }

  &:after {
    content: "";
    display: inline-block;
    width: 0;
    height: 100%;
    vertical-align: middle;
  }

  .line {
    &:last-child {
      animation: loadingC 0.6s 0.1s linear infinite;
    }

    &:nth-last-child(2) {
      animation: loadingC 0.6s 0.2s linear infinite;
    }

    &:nth-last-child(3) {
      animation: loadingC 0.6s 0.3s linear infinite;
    }
  }
}
@keyframes loadingC {
  0% {
    -webkit-transform: translate(0, 0);
    transform: translate(0, 0);
  }

  50% {
    -webkit-transform: translate(0, 50%);
    transform: translate(0, 50%);
  }

  to {
    -webkit-transform: translate(0, 0);
    transform: translate(0, 0);
  }
}
</style>
