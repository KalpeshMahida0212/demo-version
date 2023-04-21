const button = document.querySelector("button");
const header = document.querySelector("h1");
const graphic = document.querySelector("div");

const actions = [
	{
		text: "Kidhar gyi!",
		move: "translate(80%, -30%)"
	},
	{
		text: "jali krr",
		move: "translate(-100%, -70%)"
	},
	{
		text: "<span class='material-symbols-outlined'>sentiment_excited</span>",
		move: "translate(120%, 80%)"
	},
	{
		text: "<span class='material-symbols-outlined'>play_arrow</span>",
		move: "translate(0, 0)"
	},
	{
		text: "oyeee",
		move: "translate(-80%, 100%)"
	},
	{
		text: "aana",
		move: "translate(10%, -150%)"
	}
];

const getRandomInt = (max) => {
	return Math.floor(Math.random() * max);
};

button.addEventListener("mouseover", () => {
	index = getRandomInt(actions.length);
	if (button.classList.contains("play")) {
		button.innerHTML = actions[index].text;
		button.style.transform = actions[index].move;
	}
});

button.addEventListener("click", () => {
	if (button.classList.contains("play")) {
		button.classList.remove("play");
		button.classList.add("pause");
		button.style.transform = "translate(0,0)";

		graphic.classList.add("dot");

		
	} else if (button.classList.contains("pause")) {
		button.classList.remove("pause");
		button.classList.add("play");
		button.style.transform = "translate(0,0)";

		graphic.classList.remove("dot");

		button.innerHTML =
			"<span class='material-symbols-outlined'>play_arrow</span>";
		header.innerHTML = "Press play... if you can";
	}
});

button.addEventListener("click", () => {
	window.location.href = "end.html";
});


let index = 0,
    interval = 1000;

const rand = (min, max) => 
  Math.floor(Math.random() * (max - min + 1)) + min;

const animate = star => {
  star.style.setProperty("--star-left", `${rand(-10, 100)}%`);
  star.style.setProperty("--star-top", `${rand(-40, 80)}%`);

  star.style.animation = "none";
  star.offsetHeight;
  star.style.animation = "";
}

for(const star of document.getElementsByClassName("magic-star")) {
  setTimeout(() => {
    animate(star);
    
    setInterval(() => animate(star), 1000);
  }, index++ * (interval / 3))
}

/* -- ↓↓↓ If you want the sparkle effect to only occur on hover, replace lines 16 and on with this code ↓↓↓ -- */

// let timeouts = [],
//     intervals = [];

// const magic = document.querySelector(".magic");

// magic.onmouseenter = () => {
//   let index = 1;
  
//   for(const star of document.getElementsByClassName("magic-star")) {
//     timeouts.push(setTimeout(() => {  
//       animate(star);
      
//       intervals.push(setInterval(() => animate(star), 1000));
//     }, index++ * 300));
//   };
// }

// magic.onmouseleave = onMouseLeave = () => {
//   for(const t of timeouts) clearTimeout(t);  
//   for(const i of intervals) clearInterval(i);
  
//   timeouts = [];
//   intervals = [];
// }