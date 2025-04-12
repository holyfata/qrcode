import { HfQrcode } from "@holyfata/qrcode-react"

function App() {
	return (
		<div className="App">
			<HfQrcode value="Hello, World!" options={{ width: 200 }}></HfQrcode>
		</div>
	);
}

export default App;
