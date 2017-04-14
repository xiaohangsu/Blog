(()=>{
	let imgEle = document.getElementsByClassName('logo-link')[0].children[0];
	let icon   = document.querySelector("link[rel*='icon']");
	setInterval(()=> {
		let sourceStr = 'http://localhost:4000/emoji_gif_100px/emoji_'
		+ Math.floor(Math.random() * 28 + 1)  + '.gif';
		imgEle.src = sourceStr;
		icon.href = sourceStr;
	}, 5000);
})();
