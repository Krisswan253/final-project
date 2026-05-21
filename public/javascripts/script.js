// FRONT END JAVASCRIPT

const form = document.querySelector("#entryForm");
const entriesContainer = document.querySelector("#entriesContainer");

let allEntries = [];

/* GET ALL MEMORIES FROM DATABASE */
async function getEntries() {
    const response = await fetch("/entries");
    const entries = await response.json();

    allEntries = entries;

    updateArchiveStats(allEntries);
    createFilterButtons(allEntries);
    displayEntries(allEntries);
}

/* CHANGE YEAR INTO "YEARS AGO" */
function getYearsAgo(year) {
    const currentYear = new Date().getFullYear();
    const numberYear = Number(year);

    if (!numberYear) {
        return year;
    }

    const yearsAgo = currentYear - numberYear;

    if (yearsAgo <= 0) {
        return year;
    }

    if (yearsAgo == 1) {
        return "1 year ago";
    }

    return yearsAgo + " years ago";
}

/* CREATE FILTER BUTTONS FROM FEELINGS */
function createFilterButtons(entries) {
    let filterBox = document.querySelector("#filterBox");

    if (!filterBox) {
        filterBox = document.createElement("div");
        filterBox.id = "filterBox";

        const archiveSection = document.querySelector(".archive");
        archiveSection.insertBefore(filterBox, entriesContainer);
    }

    let feelings = [];

    for (let i = 0; i < entries.length; i++) {
        if (entries[i].emotion && !feelings.includes(entries[i].emotion)) {
            feelings.push(entries[i].emotion);
        }
    }

    let buttonsHTML = `
        <button class="filter-btn" data-filter="all">all</button>
    `;

    for (let i = 0; i < feelings.length; i++) {
        buttonsHTML += `
            <button class="filter-btn" data-filter="${feelings[i]}">
                ${feelings[i]}
            </button>
        `;
    }

    filterBox.innerHTML = buttonsHTML;

    const filterButtons = document.querySelectorAll(".filter-btn");

    for (let i = 0; i < filterButtons.length; i++) {
        filterButtons[i].addEventListener("click", function () {
            const filter = filterButtons[i].dataset.filter;

            if (filter == "all") {
                displayEntries(allEntries);
            } else {
                const filteredEntries = allEntries.filter(function (entry) {
                    return entry.emotion == filter;
                });

                displayEntries(filteredEntries);
            }
        });
    }
}

/* ARCHIVE STATS + MEMORY HIGHLIGHT BUTTON */
function updateArchiveStats(entries) {
    let statsBox = document.querySelector("#archiveStats");

    if (!statsBox) {
        statsBox = document.createElement("div");
        statsBox.id = "archiveStats";

        const archiveSection = document.querySelector(".archive");
        archiveSection.insertBefore(statsBox, entriesContainer);
    }

    if (entries.length == 0) {
        statsBox.innerHTML = `
            <button id="randomMemoryBtn">memory highlight</button>
            <p>no memories created yet</p>
        `;
        return;
    }

    const feelings = {};

    for (let i = 0; i < entries.length; i++) {
        const feeling = entries[i].emotion;

        if (feeling) {
            if (feelings[feeling]) {
                feelings[feeling]++;
            } else {
                feelings[feeling] = 1;
            }
        }
    }

    let mostCommonFeeling = "unknown";
    let highestCount = 0;

    for (let feeling in feelings) {
        if (feelings[feeling] > highestCount) {
            mostCommonFeeling = feeling;
            highestCount = feelings[feeling];
        }
    }

    statsBox.innerHTML = `
        <button id="randomMemoryBtn">memory highlight</button>

        <p>
            <strong>${entries.length}</strong> memories created
            •
            most common feeling:
            <strong>${mostCommonFeeling}</strong>
        </p>
    `;

    const randomMemoryBtn = document.querySelector("#randomMemoryBtn");

    randomMemoryBtn.addEventListener("click", function () {
        const randomEntry = entries[Math.floor(Math.random() * entries.length)];
        openMemoryPopup(randomEntry);
    });
}

/* DISPLAY ARCHIVE CARDS */
function displayEntries(entries) {
    entriesContainer.innerHTML = "";

    for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];

        const card = document.createElement("div");
        card.classList.add("memory-card");

        card.innerHTML = `
            <p class="file-label">saved memory</p>

            <h3>${entry.title}</h3>

            <div class="memory-text-wrap">
                <p class="memory-text">${entry.memory}</p>
            </div>

            ${entry.memory.length > 120 ? `<button class="more-btn">more ↓</button>` : ""}

            ${entry.image ? `<img class="memory-image" src="${entry.image}" alt="submitted memory image">` : ""}

            <div class="meta">
                <span class="bubble year-bubble">${getYearsAgo(entry.year)}</span>
                <span class="bubble emotion-bubble">${entry.emotion}</span>
                <span class="bubble clarity-bubble">${entry.clarity}</span>
            </div>

            <button class="comment-open-btn">
                <strong>${entry.comments ? entry.comments.length : 0}</strong> comments
            </button>
        `;

        entriesContainer.appendChild(card);

        const memoryTextWrap = card.querySelector(".memory-text-wrap");
        const moreBtn = card.querySelector(".more-btn");

        if (moreBtn) {
            moreBtn.addEventListener("click", function () {
                memoryTextWrap.classList.toggle("open");

                if (memoryTextWrap.classList.contains("open")) {
                    moreBtn.textContent = "less ↑";
                } else {
                    moreBtn.textContent = "more ↓";
                }
            });
        }

        const commentBtn = card.querySelector(".comment-open-btn");

        commentBtn.addEventListener("click", function () {
            openMemoryPopup(entry);
        });
    }
}

/* POPUP FOR FULL MEMORY + COMMENTS */
function openMemoryPopup(entry) {
    const popup = document.createElement("div");
    popup.classList.add("image-popup");

    let commentsHTML = "";

    if (entry.comments && entry.comments.length > 0) {
        for (let i = 0; i < entry.comments.length; i++) {
            commentsHTML += `<p class="comment">${entry.comments[i].text}</p>`;
        }
    } else {
        commentsHTML = `<p class="no-comments">no comments yet.</p>`;
    }

    popup.innerHTML = `
        <div class="popup-memory-wrap">
            <button class="close-popup">X</button>

            <div class="popup-memory-card">
                <p class="file-label">saved memory</p>

                <h3>${entry.title}</h3>

                <p class="popup-memory-text">${entry.memory}</p>

                ${entry.image ? `<img class="memory-image" src="${entry.image}" alt="submitted memory image">` : ""}

                <div class="meta">
                    <span class="bubble year-bubble">${getYearsAgo(entry.year)}</span>
                    <span class="bubble emotion-bubble">${entry.emotion}</span>
                    <span class="bubble clarity-bubble">${entry.clarity}</span>
                </div>

                <div class="comments-section">
                    <form class="comment-form" data-id="${entry._id}">
                        <input 
                            type="text" 
                            class="comment-input"
                            placeholder="leave a comment"
                            required
                        >

                        <button type="submit" class="comment-btn">
                            send
                        </button>
                    </form>

                    <div class="comments-list">
                        ${commentsHTML}
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(popup);
}

/* SUBMIT NEW MEMORY */
form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = new FormData();

    formData.append("title", document.querySelector("#title").value);
    formData.append("memory", document.querySelector("#memory").value);
    formData.append("year", document.querySelector("#year").value);
    formData.append("emotion", document.querySelector("#emotion").value);
    formData.append("clarity", document.querySelector("#clarity").value);

    const imageInput = document.querySelector("#image");

    if (imageInput.files.length > 0) {
        formData.append("image", imageInput.files[0]);
    }

    await fetch("/entries", {
        method: "POST",
        body: formData
    });

    form.reset();
    getEntries();
});

/* IMAGE POPUP + CLOSE POPUP */
document.addEventListener("click", function (event) {
    if (event.target.classList.contains("memory-image")) {
        const popup = document.createElement("div");
        popup.classList.add("image-popup");

        popup.innerHTML = `
            <div class="popup-image-wrap">
                <button class="close-popup">X</button>
                <img src="${event.target.src}" alt="expanded memory image">
            </div>
        `;

        document.body.appendChild(popup);
    }

    if (event.target.classList.contains("close-popup")) {
        document.querySelector(".image-popup").remove();
    }
});

/* SUBMIT COMMENT */
document.addEventListener("submit", async function (event) {
    if (event.target.classList.contains("comment-form")) {
        event.preventDefault();

        const entryId = event.target.dataset.id;
        const input = event.target.querySelector(".comment-input");

        await fetch(`/entries/${entryId}/comments`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                text: input.value
            })
        });

        document.querySelector(".image-popup").remove();
        getEntries();
    }
});

getEntries();