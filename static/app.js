let search = document.getElementById("search")
let submit_btn = document.querySelector("button")

// Function to send fetch request to the Flask backend
async function getData(topic) {
    let response = await fetch("/", {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({ query: topic })
    })
    return response.json()
}

submit_btn.addEventListener("click", async () => {
    let query = search.value.trim();
    if (query.length > 0) {
        search.value = "";
        submit_btn.innerHTML = 'Loading <span id="loading"></span>'
        try {
            let error_p = document.querySelector('p#error')   // Remove the error message
            error_p.remove()
        } catch (err) { }
        try {   // Clear the previous search related elements
            let prev_link = document.querySelector('a')
            prev_link.remove()
            let total_p = document.querySelector('p#total')
            total_p.remove()
            let img_container = document.querySelector('div.img_container')
            img_container.remove()
        } catch (err) {
            console.log(err)
        }
        let result = await getData(query);    // Result from the backend
        if (result != "error") {   // No error
            submit_btn.innerHTML = 'Search <i class="fa-solid fa-magnifying-glass-arrow-right"></i>'
            let link = document.createElement('a')
            link.download = `${query}-images.zip`
            link.href = './static/images-archived.zip'
            link.innerHTML = 'Download <i class="fa-solid fa-file-arrow-down"></i>'

            let p = document.createElement('p')
            p.setAttribute('id', 'total')
            p.innerText = `Total ${result['total']} images, showing 3`

            let img_container = document.createElement('div')
            img_container.setAttribute('class', 'img_container')
            rand_1 = Math.floor(Math.random() * (result['total'] - 1))
            rand_2 = Math.floor(Math.random() * (result['total'] - 1))
            rand_3 = Math.floor(Math.random() * (result['total'] - 1))
            img_1 = new Image()
            img_1.src = `./static/images/${query}/${query}-img-${rand_1}.jpg`
            img_2 = new Image()
            img_2.src = `./static/images/${query}/${query}-img-${rand_2}.jpg`
            img_3 = new Image()
            img_3.src = `./static/images/${query}/${query}-img-${rand_3}.jpg`
            img_container.append(img_1, img_2, img_3)
            document.body.append(link, p, img_container)
        } else {  // Error
            submit_btn.innerHTML = 'Search <i class="fa-solid fa-magnifying-glass-arrow-right"></i>'
            let p = document.createElement('p')
            p.setAttribute('id', 'error')
            p.innerText = `Something went wrong. Make sure you have a reliable internet connection!`
            document.body.append(p)
        }

    }
})

search.addEventListener("keydown", (event) => {
    if (event.key == 'Enter') {
        submit_btn.click()
    }
})