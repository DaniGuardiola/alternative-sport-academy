var md = new Paperkit();
window.addEventListener('load',function(){
	md.init();
});

function jumpTo(e) {
	console.log(e.getAttribute('data-time'));
	document.querySelector('video').currentTime = e.getAttribute('data-time');
}

function openTrick(what){
	if (isMobile()) {
		transition.morph(what,'full',function(el){
			md.ajaxInsert(what.getAttribute('data-trick'),el,function(){
				md.justInCase("reload");
				state.tricks.trick();
			});
		});
	} else {
		openTrickOld(what);
	}
}

function openTrickOld(what){
	if (what) {
		transition.status.lastMorphFrom = getEl(what);
	} else {
		return false;
	}
	md.content.classList.add('op-0-child');
	md.toolbar.style.zIndex = 0;
		var whatStyle = window.getComputedStyle(getEl(what));
		var whatClon = document.createElement('div');
		whatClon.id = "md-morph";
		whatClon.setAttribute("md-shadow","shadow-0");
		whatStyle = window.getComputedStyle(getEl(what));
		if (whatStyle.zIndex >= 400) {
			whatClon.style.zIndex = whatStyle.zIndex + 1;
		} else {
			whatClon.style.zIndex = "400";
		}
		whatClon.style.backgroundColor = "transparent";
		transition.copyRect(whatClon,what,false,true);
		document.body.appendChild(whatClon);
		setTimeout(function(){
			whatClon.setAttribute("md-shadow","shadow-3");
			if (whatStyle.backgroundColor != 'rgba(0, 0, 0, 0)') {
				whatClon.style.backgroundColor = whatStyle.backgroundColor;
			} else {
				whatClon.style.backgroundColor = "#fff";
			}
		},10);
		setTimeout(function(){			
			whatClon.style.transitionTimingFunction = 'ease-in';
			whatClon.style.transitionProperty = 'all';
			whatClon.style.transitionDuration = '0.25s';
			whatClon.style.maxWidth = '960px';
			whatClon.style.left = '50%';
			whatClon.style.transform = 'translate(-50%,0)';
			whatClon.style.top = '64px';
			whatClon.setAttribute('md-height','x6');
			whatClon.style.height = '';
			setTimeout(function(){
				md.toolbar.set('height','x3');
				whatClon.removeAttribute('md-height');
			},500);
			getEl(what).style.opacity = 0;
		},210);

	md.ajaxInsert(what.getAttribute('data-trick'),whatClon,function(){
		md.justInCase("reload");
		state.tricks.trick();
	});
}

function closeTrick(){
	transition.morphBack();
	md.content.classList.add('op-1-child');
	md.content.classList.remove('op-0-child');
}