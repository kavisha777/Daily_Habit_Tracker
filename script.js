const habitForm = document.getElementById("habitForm");
    const habitTitle = document.getElementById("habitTitle");
    const habitCategory = document.getElementById("habitCategory");
    const habitList = document.getElementById("habitList");
    const toggleDark = document.getElementById("toggleDark");

    const modal = document.getElementById("modal");
    const modalTitle = document.getElementById("modalTitle");
    const modalCategory = document.getElementById("modalCategory");
    const modalStreak = document.getElementById("modalStreak");
    const modalTotal = document.getElementById("modalTotal");
    const modalHistory = document.getElementById("modalHistory");

    let habits = JSON.parse(localStorage.getItem("habits")) || [];
    const today = new Date().toISOString().split('T')[0];

    function saveHabits() {
      localStorage.setItem("habits", JSON.stringify(habits));
    }

    function renderHabits() {
      habitList.innerHTML = "";
      habits.forEach((habit, index) => {
        const isCompleted = habit.history?.[today] || false;
        const streak = calculateStreak(habit.history);

        const habitDiv = document.createElement("div");
        habitDiv.className = "p-4 border rounded flex flex-col gap-2";
        habitDiv.innerHTML = `
          <div class="flex justify-between items-center">
            <div>
              <p class="font-semibold">${habit.title}</p>
              <p class="text-sm text-gray-500">${habit.category || "No Category"}</p>
            </div>
            <div class="flex items-center gap-2">
              <button class="text-blue-500" onclick="viewDetails(${index})">Details</button>
              <button class="text-red-500" onclick="deleteHabit(${index})">Delete</button>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <label><input type="checkbox" ${isCompleted ? "checked" : ""} onchange="toggleComplete(${index}, this.checked)"> Done Today</label>
            <span>Streak: ${streak}</span>
          </div>
        `;
        habitList.appendChild(habitDiv);
      });
    }

    function toggleComplete(index, checked) {
      if (!habits[index].history) habits[index].history = {};
      habits[index].history[today] = checked;
      saveHabits();
      renderHabits();
    }

    function deleteHabit(index) {
      if (confirm("Are you sure you want to delete this habit?")) {
        habits.splice(index, 1);
        saveHabits();
        renderHabits();
      }
    }

    function calculateStreak(history) {
      if (!history) return 0;
      const dates = Object.keys(history).sort().reverse();
      let streak = 0;
      for (let date of dates) {
        if (history[date]) streak++;
        else break;
      }
      return streak;
    }

    function countTotalCompletions(history) {
      return Object.values(history || {}).filter(Boolean).length;
    }

    function viewDetails(index) {
      const habit = habits[index];
      modalTitle.textContent = habit.title;
      modalCategory.textContent = `Category: ${habit.category || "None"}`;
      modalStreak.textContent = `Current Streak: ${calculateStreak(habit.history)}`;
      modalTotal.textContent = `Total Completions: ${countTotalCompletions(habit.history)}`;

      modalHistory.innerHTML = "";
      Object.entries(habit.history || {}).forEach(([date, done]) => {
        const li = document.createElement("li");
        li.textContent = `${date}: ${done ? "✔️" : "❌"}`;
        modalHistory.appendChild(li);
      });

      modal.classList.remove("hidden");
    }

    function closeModal() {
      modal.classList.add("hidden");
    }

    habitForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const title = habitTitle.value.trim();
      if (!title) return;

      habits.push({
        title,
        category: habitCategory.value.trim(),
        history: {}
      });

      habitTitle.value = "";
      habitCategory.value = "";
      saveHabits();
      renderHabits();
    });

    toggleDark.addEventListener("click", () => {
      document.body.classList.toggle("dark");
      localStorage.setItem("darkMode", document.body.classList.contains("dark"));
    });

    if (localStorage.getItem("darkMode") === "true") {
      document.body.classList.add("dark");
    }

    renderHabits();