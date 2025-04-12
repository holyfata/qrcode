# @holyfata/qrcode

## Description

The library to generate qr-code.

## Setup

### For Vue

```bash
npm i @holyfata/vanilla @holyfata/vue
```

```vue
<script setup lang="ts">
import { HfQrcode } from "@holyfata/qrcode-vue"
</script>

<template>
	<div>
		<hf-qrcode value="Hello, World!" :options="{ width: 200 }"></hf-qrcode>
	</div>
</template>
```

### For React

```bash
npm i @holyfata/vanilla @holyfata/react
```

```tsx
import { HfQrcode } from "@holyfata/qrcode-react"

function App() {
	return (
		<div className="App">
			<HfQrcode value="Hello, World!" options={{ width: 200 }}></HfQrcode>
		</div>
	);
}

export default App;
```

## Inspired

- [@chenfengyuan/vue-qrcode](https://github.com/fengyuanchen/vue-qrcode)

## License

[MIT LICENSE](./LICENSE)
