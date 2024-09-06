<script>
import RecursiveMenuItem from './RecursiveMenuItem.vue';
import BreadcrumbsComponent from './BreadcrumbsComponent.vue';
import { mapState, mapActions } from 'vuex';
export default {
    data() {
        return {
            newName: '',
            newUnderName: '',
            newPlaceholderParent: "Название меню",
            activeItemId: null,
            breadcrumbPath: [],
            menuTree: []
        }
    },
    components: {
        BreadcrumbsComponent,
        RecursiveMenuItem,
    },
    computed: {
        ...mapState({
            isAuthenticated: state => state.isAuthenticated,
            role: state => state.isRole
        }),
    },
    methods: {
        ...mapActions(['setAuthenticated', 'setRole']),
        loadMenu() {
            const requestSettings = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            };
            fetch('http://localhost:3000/apiMenu/menu_items', requestSettings)
                .then(response => response.json())
                .then(data => {
                    this.menuTree = data.menu;
                })
                .catch(error => console.error('Ошибка загрузки меню:', error));
        },
        toggleInput(event) {
            const button = event.target;
            const buttonContains = className => button.classList.contains(className);
            const parent = button.closest('.menuEditor');
            const child = parent?.querySelector('.sectionGap__parent_child .change');

            if (buttonContains('change') || buttonContains('buttonChild')) {
                const inputs = parent?.querySelectorAll('input');
                if (inputs && inputs.length > 1) {
                    const inputToFocus = child || buttonContains('buttonChild') ? inputs[1] : inputs[0];
                    inputToFocus.focus();
                }
            }
        },
        toggleActive(id) {
            this.updateBreadcrumb(this.menuTree, id)
            this.resetActiveState(this.menuTree, id);
            this.updateActiveState(this.menuTree, id);
            this.buildTree();
        },
        resetActiveState(items, idToActivate) {
            items.forEach(item => {
                if (item.id !== idToActivate && (!item.child || !this.containsActiveChild(item.child, idToActivate))) {
                    item.isActive = false;
                }
                if (item.child) {
                    this.resetActiveState(item.child, idToActivate);
                }
            });
        },
        containsActiveChild(items, idToActivate) {
            return items.some(item => item.id === idToActivate || (item.child && this.containsActiveChild(item.child, idToActivate)));
        },
        updateActiveState(items, idToActivate) {
            items.forEach(item => {
                if (item.id === idToActivate) {
                    item.isActive = !item.isActive;
                }
                if (item.child) {
                    this.updateActiveState(item.child, idToActivate);
                }
            });
        },
        addMenuItem(parentId = null) {
            const newItem = {
                id: Date.now(),
                title: this.newName,
                isActive: false,
                parentId,
                child: [],
            };
            if (parentId === null) {
                this.menuTree.push(newItem);
            } else {
                this.menuTree = this.addToParent(this.menuTree, parentId, newItem);
            }
            this.buildTree();
        },
        addToParent(items, parentId, newItem) {
            return items.map((item) => {
                if (item.id === parentId) {
                    if (!Array.isArray(item.child)) {
                        item.child = [];
                    }
                    item.child.push(newItem);
                } else if (item.child) {
                    item.child = this.addToParent(item.child, parentId, newItem);
                }
                return item;
            });
        },
        editMenuItem(id) {
            this.menuTree = this.updateItem(this.menuTree, id, (item) => {
                item.title = this.newName;
            });
            this.buildTree();
        },
        updateItem(items, id, updateFn) {
            return items.map((item) => {
                if (item.id === id) {
                    updateFn(item);
                } else if (item.child) {
                    item.child = this.updateItem(item.child, id, updateFn);
                }
                return item;
            });
        },
        buildTree() {
            const rootItems = [];
            const childrenMap = {};
            this.menuTree.forEach(item => {
                const { parentId } = item;
                if (!parentId) {
                    rootItems.push(item);
                } else {
                    if (!childrenMap[parentId]) {
                        childrenMap[parentId] = [];
                    }
                    childrenMap[parentId].push(item);
                }
            });

            const attachChildren = (items) => {
                items.forEach(item => {
                    if (childrenMap[item.id]) {
                        item.child = childrenMap[item.id];
                        attachChildren(item.child);
                    }
                });
            };

            attachChildren(rootItems);
            this.menuTree = rootItems;
        },
        deleteItemFromMenu(items, idToDelete) {
            return items.reduce((result, item) => {
                if (item.id === idToDelete) {
                    return result;
                }
                if (item.child) {
                    item.child = this.deleteItemFromMenu(item.child, idToDelete);
                }
                result.push(item);
                return result;
            }, []);
        },
        deleteMenuItem(id) {
            this.menuTree = this.deleteItemFromMenu(this.menuTree, id);
            this.buildTree();
        },
        saveMenu() {
            // Рекурсивная функция для очистки структуры меню
            const cleanMenuStructure = (items) => {
                return items.map(item => {
                    const { id, title, isActive, child } = item;
                    return {
                        id,
                        title,
                        isActive,
                        child: child ? cleanMenuStructure(item.child) : [] // Рекурсивно обрабатываем дочерние элементы
                    };
                });
            };

            // Преобразуем структуру меню для отправки на сервер
            const cleanedMenu = cleanMenuStructure(this.menuTree);

            const requestSettings = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ menu: cleanedMenu }),
            };

            fetch('http://localhost:3000/apiMenu/menu_items/save', requestSettings)
                .then(response => response.json())
                .then(data => console.log('Menu saved:', data))
                .catch(error => console.error('Error saving menu:', error));
        },
        updateBreadcrumb(array, id) {
            this.breadcrumbPath = [];
            this.findBreadcrumbPath(array, id);
        },

        findBreadcrumbPath(array, id) {
            for (const item of array) {
                if (item.id === id) {
                    this.breadcrumbPath.push(item.title);
                    return true;
                }
                if (item.child && this.findBreadcrumbPath(item.child, id)) {
                    this.breadcrumbPath.unshift(item.title);
                    return true;
                }
            }
            return false;
        },
    },
    mounted() {
        this.loadMenu();
        this.buildTree();
        window.addEventListener('click', this.handleClickOutside);
        window.addEventListener('click', this.toggleInput);
    },
};
</script>
<template>
    <section class="menuEditor">
        <transition-group name="slide-fade" tag="ul" class="menuEditor__wrapper"
            :class="{ 'menuEditor__wrapper--forUser': role !== 'admin' }">
            <recursive-menu-item v-for="item in menuTree" :key="item.id" :item="item" :role="role"
                :breadcrumb-path="breadcrumbPath" @toggle-active="toggleActive" @edit-item="editMenuItem"
                @delete-item="deleteMenuItem" @add-menu-item="addMenuItem" @click-breadcrumb="updateBreadcrumb" />
        </transition-group>
        <BreadcrumbsComponent :breadcrumb-path="breadcrumbPath"></BreadcrumbsComponent>
    </section>
    <div v-if="role === 'admin'" class="sectionMenu">
        <h2>Редактор меню</h2>
        <input type="text" v-model="newName" :placeholder="newPlaceholderParent" />
        <button @click="addMenuItem()">Добавить</button>
        <button @click="saveMenu()">Сохранить изменения</button>
    </div>
</template>