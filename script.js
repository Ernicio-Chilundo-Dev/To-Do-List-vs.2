document.addEventListener('DOMContentLoaded', () => {
  const taskForm = document.getElementById('task-form');
  const titleInput = document.getElementById('task-title');
  const descInput = document.getElementById('task-desc');

  let tasks = JSON.parse(localStorage.getItem('kanbanTasks')) || [];

  const columns = {
    todo: document.getElementById('todo'),
    progress: document.getElementById('progress'),
    done: document.getElementById('done')
  };

  function render() {
    // Limpar
    Object.values(columns).forEach(col => col.innerHTML = '');

    const counts = { todo: 0, progress: 0, done: 0 };

    tasks.forEach((task, index) => {
      const card = document.createElement('div');
      card.className = 'task';
      card.draggable = true;
      card.innerHTML = `
        <div class="task-header">
          <strong>${task.title}</strong>
          <button class="delete-btn" data-index="${index}">✖</button>
        </div>
        <small>${task.description}</small>
      `;

      card.addEventListener('dragstart', () => {
        card.classList.add('dragging');
        card.dataset.dragIndex = index;
      });

      card.addEventListener('dragend', () => {
        card.classList.remove('dragging');
      });

      columns[task.status].appendChild(card);
      counts[task.status]++;
    });

    document.querySelectorAll('.column').forEach(col => {
      const status = col.dataset.status;
      col.querySelector('.count').textContent = counts[status];
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const index = btn.dataset.index;
        tasks.splice(index, 1);
        save();
        render();
      });
    });

    addDropEvents();
  }

  function addDropEvents() {
    document.querySelectorAll('.task-list').forEach(list => {
      list.addEventListener('dragover', (e) => e.preventDefault());
      list.addEventListener('drop', (e) => {
        const draggingCard = document.querySelector('.dragging');
        const index = draggingCard.dataset.dragIndex;
        const newStatus = list.id;
        tasks[index].status = newStatus;
        save();
        render();
      });
    });
  }

  function save() {
    localStorage.setItem('kanbanTasks', JSON.stringify(tasks));
  }

  taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = titleInput.value.trim();
    const description = descInput.value.trim();
    if (title) {
      tasks.push({ title, description, status: 'todo' });
      titleInput.value = '';
      descInput.value = '';
      save();
      render();
    }
  });

  render();
});
