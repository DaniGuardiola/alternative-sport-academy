var md = new Materializer();
window.addEventListener('load',function(){
	md.init();
});

function jumpTo(e) {
	console.log(e.getAttribute('data-time'));
	document.querySelector('video').currentTime = e.getAttribute('data-time');
}

function openTrick(el){
	md.content.classList.add('op-0-child');
	md.toolbar.style.zIndex = 0;
	transition.morph(el,'full',function(e){
		md.ajaxInsert(el.getAttribute('data-trick'),e,function(){
		md.content.classList.add('op-1-child');
		md.content.classList.remove('op-0-child');
			md.justInCase("reload");
			state.tricks.trick();
		})
	});
}