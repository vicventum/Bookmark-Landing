const collapsibleItems = [...(document.querySelectorAll('ul.collapsible li'))]
let icon
let index = "none"

collapsibleItems.forEach(el => {
  el.addEventListener('click', activeItem)
});

M.Tabs.init(document.querySelectorAll('.tabs'), {
  
});

// console.log(collapsibleItems);
M.Collapsible.init(document.getElementById('collapsible'), {
  onOpenStart: () => {
    // Collapsible Instance
  },
  onCloseStart: () => {
  icon.style.color = 'hsl(231, 69%, 60%)'
  icon.innerHTML = '▼'
  }
})

function activeItem(e) {
  icon = e.target.firstElementChild
  icon.style.color = 'hsl(0, 94%, 66%)'
  icon.innerHTML = '▲'
  console.log(e);
  console.log(e.target.firstElementChild);
}