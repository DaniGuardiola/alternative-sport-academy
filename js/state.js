state = {
  data: {},
  // Functions
  progress: {
    index: function() {
      md.toolbar.setAttribute("md-color", "purple");
      md.toolbar.querySelector("md-text").textContent = "Progreso";
      setTimeout(md.sidemenu.close, 200);
    }
  },
  tracks: {
    index: function() {
      md.toolbar.setAttribute("md-color", "purple");
      md.toolbar.querySelector("md-text").textContent = "Cursos";
      setTimeout(md.sidemenu.close, 200);
    }
  },
  movements: {
    index: function() {
      md.toolbar.setAttribute("md-color", "purple");
      md.toolbar.querySelector("md-text").textContent = "Movimientos";
      setTimeout(md.sidemenu.close, 200);

      // Garbage: tile generator
      var colors = [
        "blue",
        "red ",
        "orange",
        "green",
        "cyan",
        "brown",
        "light-blue",
        "light-green",
        "lime",
        "indigo"
      ];
      var grid = document.querySelector("body>md-content>.grid");
      var tile = grid.querySelector(".child");
      var lastN = 0;
      var newTile, n, color;
      for (var i = 2; i <= 20; i++) {
        newTile = tile.cloneNode();
        newTile.innerHTML = tile.innerHTML;
        n = Math.floor(Math.random() * colors.length);
        if (n === lastN) {
          if (n < colors.length - 1) {
            n = n + 1;
          } else {
            n = 0;
          }
        }
        lastN = n;
        color = colors[n];
        newTile.querySelector(".layout>md-content").setAttribute("md-color", color);
        newTile.querySelector(".layout>md-toolbar md-text").textContent = "Categoría " + i;
        grid.appendChild(newTile);
      }
      md.initElement(grid);
      [].forEach.call(grid.querySelectorAll(".child"), function(tile) {
        tile.addEventListener("click", function(e) {
          var tile = e.currentTarget;
          transition.morph(tile, false, function(el) {
            md.ajaxInsert("page/movements/movement.html", el, function() {
              md.init(el);
            });
          });
        });
      });
    }
  },
  glossary: {
    index: function() {
      md.toolbar.setAttribute("md-color", "purple");
      md.toolbar.querySelector("md-text").textContent = "Glosario";
      setTimeout(md.sidemenu.close, 200);
    }
  }
};
