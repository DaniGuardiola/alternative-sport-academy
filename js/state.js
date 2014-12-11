state = {
    data: {
    },
    // Functions
    progress: {
        index: function() {
            md.toolbar.set('color','purple');
            state.now.inbox();
            setTimeout(md.sidemenu.close,200);
        },
        inbox: function() {
            md.toolbar.querySelector('md-text').innerHTML = 'Now<span md-font-color="purple-200"> - Inbox</span>';
            md.fab.show();
            md.fab.set('color','green');
            md.fab.set('image','done_all');
        },
        upcoming: function() {
            md.toolbar.querySelector('md-text').innerHTML = 'Now<span md-font-color="purple-200"> - Upcoming</span>';
            md.fab.hide();
        },
        today: function() {
            md.toolbar.querySelector('md-text').innerHTML = 'Now<span md-font-color="purple-200"> - Today</span>';
            md.fab.hide();
        }
    },
    lessons: {
        index: function() {
            md.toolbar.set('color','blue');
            md.toolbar.querySelector('md-text').innerHTML = "Lecciones";
            md.fab.show();
            md.fab.set('color','purple');
            md.fab.set('image','add');
            setTimeout(md.sidemenu.close,200);
        }
    },
    tricks: {
        index: function() {
            md.toolbar.set('color','red');
            md.toolbar.querySelector('md-text').innerHTML = "Tricks";
            setTimeout(md.sidemenu.close,200);
        },
        trick: function() {
        }
    }
};