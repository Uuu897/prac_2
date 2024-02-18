new Vue({
    el: '#app',
    data() {
        return {
            column1: JSON.parse(localStorage.getItem('column1')) || [],
            column2: JSON.parse(localStorage.getItem('column2')) || [],
            column3: JSON.parse(localStorage.getItem('column3')) || [],
            newCardTitle: '',
            newItemText: [],
            priority: '',
            showForm: false,
            showItemForm: false,
            column1SelectedSortMethod: '',
            column2SelectedSortMethod: '',
            column3SelectedSortMethod: '',
        };
    },
    computed: {
        prioritizedColumn1() {
            return this.column1.slice().sort((a, b) => b.priority - a.priority);
        },
        prioritizedColumn2() {
            return this.column2.slice().sort((a, b) => b.priority - a.priority);
        },
        prioritizedColumn3() {
            return this.column3.slice().sort((a, b) => b.priority - a.priority);
        }
    },
    methods: {
        handleCardPosition(card) {
            const totalItems = card.items.length;
            const completedItems = card.items.filter(item => item.completed).length;

            if (completedItems / totalItems > 0.5 && this.column1.includes(card)) {
                if (this.column2.length < 5) {
                    this.column1.splice(this.column1.indexOf(card), 1);
                    this.column2.push(card);
                } else {
                    alert("Второй столбец переполнен");
                }
            } else if (completedItems / totalItems === 1 && this.column2.includes(card)) {
                this.column2.splice(this.column2.indexOf(card), 1);
                this.column3.push(card);
                card.completedDate = new Date().toLocaleString();
            }
            this.saveData();
        },
        addCard() {
            if (this.newCardTitle !== '' && this.column1.length < 3) {
                const newCard = {
                    id: Date.now(),
                    title: this.newCardTitle,
                    items: this.newItemText.map(item => ({ text: item, completed: false }))
                        .filter((item) => item.trim() !== ''),
                    priority: this.priority,
                };
                if (!this.priority) {
                    alert('Укажите приоритет задачи.');
                    return;
                }
                if (newCard.items.length < 3) {
                    alert("Пожалуйста, добавьте не менее 3-х пунктов, но не более 5!");
                } else if (this.newCardTitle !== '' && newCard.items.length >= 3 && newCard.items.length <= 5) {
                    this.column1.push(newCard);
                    this.handleCardPosition(newCard);
                    this.newCardTitle = '';
                    this.newItemText = ['']
                } else {
                    alert("Не более 5 пунктов!");
                }
            }
            this.saveData();
        },
        saveData() {
            localStorage.setItem('column1', JSON.stringify(this.column1));
            localStorage.setItem('column2', JSON.stringify(this.column2));
            localStorage.setItem('column3', JSON.stringify(this.column3));
        },
        addItem() {
            this.newItemText.push('');
        }
    }
})