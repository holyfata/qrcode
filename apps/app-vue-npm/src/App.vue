<script setup lang="ts">
import { HfQrcode } from "@holyfata/qrcode-vue"
</script>

<template>
	<div>
		<hf-qrcode value="Hello, World!" :options="{ width: 200 }"></hf-qrcode>
	</div>
</template>
