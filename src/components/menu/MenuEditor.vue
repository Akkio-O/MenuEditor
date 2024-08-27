<script>
import { mapState } from 'vuex';
export default {
    data() {
        return {
            menu: [],
            newName: '',
            newUnderName: '',
            newPlaceholderParent: "Название меню",
            newPlaceholderChild: "Название подменю",
            activeItemId: null,
        };
    },
    computed: {
        ...mapState({
            isAuthenticated: state => state.isAuthenticated,
            role: state => state.isRole
        }),
    },
    methods: {
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
                    this.menu = data.menu.map(item => {
                        const children = data.submenu
                            .filter(child => child.menu_item_id === item.id)
                            .map(child => ({
                                id: child.id,
                                name: child.subname,
                                menu_item_id: child.menu_item_id,
                                children: data.subsubmenu
                                    .filter(subChild => subChild.child_id === child.id)
                                    .map(subChild => ({
                                        id: subChild.id,
                                        name: subChild.name,
                                        child_id: subChild.child_id,
                                        menu_items_id: subChild.menu_items_id
                                    }))
                            }));

                        return {
                            id: item.id,
                            name: item.name,
                            children: children
                        };
                    });
                })
                .catch(error => console.error(error))
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
            this.menu = this.menu.map(item => {
                if (item.id === id) {
                    item.isActive = !item.isActive;
                } else {
                    item.isActive = false;
                }
                return item;
            });
            this.activeItemId = this.menu.find(item => item.isActive)?.id || null;
        },
        handleClickOutside(event) {
            const menuItems = event.target.closest('.menuEditor__wrapper_items');
            const underMenu = event.target.classList.contains('close');
            if (!menuItems && !underMenu) {
                this.menu = this.menu.map(item => {
                    item.isActive = false;
                    return item;
                });
                this.activeItemId = null;
            }
        },
        addMenuItem(parentId = null) {
            const newItem = {
                id: this.menu.length ? this.menu.length + 1 : 1,
                name: this.newName,
                children: []
            };
            this.addMenu(newItem, parentId);
        },
        addMenu(newItem, parentId) {
            if (this.newName !== '' && parentId === null) {
                this.menu.push(newItem);
                this.newName = '';
                this.newPlaceholderParent = 'Название меню';
            } else if (this.newUnderName !== '' && parentId !== null) {
                this.menu = this.menu.map(item => {
                    if (item.id === parentId) {
                        if (!Array.isArray(item.children)) {
                            item.children = [];
                        }
                        const newUnderItem = {
                            id: item.children.length ? item.children.length + 1 : 1,
                            name: this.newUnderName,
                            children: []
                        };
                        item.children.push(newUnderItem);
                        this.newUnderName = '';
                        this.newPlaceholderChild = 'Название подменю';
                    }
                    return item;
                });
            }
        },
        addSubChild(parentId, childId) {
            if (this.newUnderName !== '') {
                this.menu = this.menu.map(item => {
                    if (item.id === parentId) {
                        item.children = item.children.map(child => {
                            if (child.id === childId) {
                                if (!Array.isArray(child.children)) {
                                    child.children = [];
                                }
                                const newSubChild = {
                                    id: child.children.length ? child.children.length + 1 : 1,
                                    name: this.newUnderName
                                };
                                child.children.push(newSubChild);
                                this.newUnderName = '';
                                this.newPlaceholderChild = 'Название подменю';
                            }
                            return child;
                        });
                    }
                    return item;
                });
            }
        },
        editMenuItem(id, isChild = false, parentId = null, isSubChild = false, childId = null) {
            if (this.newName !== '' && !isChild && !isSubChild) {
                this.menu = this.menu.map(item => {
                    if (item.id === id) {
                        item.name = this.newName;
                        this.newName = '';
                    }
                    return item;
                });
            } else if (this.newUnderName !== '') {
                this.menu = this.menu.map(item => {
                    if (isChild && !isSubChild && item.id === parentId) {
                        item.children = item.children.map(child => {
                            if (child.id === id) {
                                child.name = this.newUnderName;
                            }
                            return child;
                        });
                        this.newUnderName = '';
                    } else if (isSubChild && item.id === parentId) {
                        item.children = item.children.map(child => {
                            if (child.id === childId) {
                                child.children = child.children.map(subChild => {
                                    if (subChild.id === id) {
                                        subChild.name = this.newUnderName;
                                    }
                                    return subChild;
                                });
                            }
                            return child;
                        });
                        this.newUnderName = '';
                    }
                    return item;
                });
            }
        },
        deleteMenuItem(id, isChild = false, parentId = null, isSubChild = false, childId = null) {
            if (isSubChild) {
                this.menu = this.menu.map(item => {
                    if (item.id === parentId) {
                        item.children = item.children.map(child => {
                            if (child.id === childId) {
                                child.children = child.children.filter(subChild => subChild.id !== id);
                            }
                            return child;
                        });
                    }
                    return item;
                });
            } else if (isChild) {
                this.menu = this.menu.map(item => {
                    if (item.id === parentId) {
                        item.children = item.children.filter(child => child.id !== id);
                        if (item.children.length === 0) {
                            item.isActive = false;
                        }
                    }
                    return item;
                });
            } else {
                this.menu = this.menu.filter(item => item.id !== id);
            }
        },
        saveMenu() {
            const menu = this.menu.map(item => {
                const { id, name, children } = item;
                return { id, name, children };
            });

            const cleanMenu = menu.map(({ id, name }) => ({ id, name }));

            const childrenMenu = menu.flatMap(item =>
                item.children.map(child => {
                    const { id, name, menu_item_id, children } = child;
                    return { id, name, menu_item_id, children };
                })
            );

            const subChildrenMenu = childrenMenu.flatMap(child =>
                child.children.map(subChild => {
                    const { id, name } = subChild;
                    return { id, name, child_id: child.id, menu_items_id: child.menu_item_id };
                })
            );

            const requestSettings = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ menu: cleanMenu, children: childrenMenu, subChildren: subChildrenMenu }),
            };

            fetch('http://localhost:3000/apiMenu/menu_items/save', requestSettings)
                .then(response => response.json())
                .then(data => console.log(data))
                .catch(error => console.error(error));
        },
    },
    mounted() {
        this.loadMenu();
        window.addEventListener('click', this.handleClickOutside);
        window.addEventListener('click', this.toggleInput);
    },
}
</script>

<template>
    <section class="menuEditor">
        <h1>Редактор меню</h1>
        <div v-if="role === 'admin'" class="sectionGap">
            <input type="text" v-model="newName" :placeholder="newPlaceholderParent">
            <input type="text" v-model="newUnderName" :placeholder="newPlaceholderChild">
            <button @click="addMenuItem()">Добавить</button>
            <button @click="saveMenu()">Сохранить изменения</button>
        </div>
        <transition-group name="slide-fade" tag="ul" class="menuEditor__wrapper">
            <li class="sectionGap menuEditor__wrapper_items" v-for="item in menu" :key="item.id" ref="menuItems"
                :class="{ 'menuEditor__wrapper_items-active': item.isActive }">
                <div v-if="role === 'admin'" class="sectionGap__parent menuEditor__wrapper_items-parent">
                    <button class="change" @click="editMenuItem(item.id)">Edit</button>
                    <button class="buttonChild" @click="addMenuItem(item.id)">+</button>
                    <button class="close" @click="deleteMenuItem(item.id)">X</button>
                </div>
                <h3 @click="toggleActive(item.id)">{{ item.name }}</h3>
                <transition name="slide-fade">
                    <ul class="menuEditor__wrapper_items-underMenu" v-if="item.isActive && item.children.length">
                        <li class="sectionGap__parent_child"
                            :class="{ 'sectionGap__parent_child-forUsers': role !== 'admin' }"
                            v-for="child in item.children" :key="child.id" ref="menuSubItems">
                            <div class="menuEditor__wrapper_items-underMenu--wrapper">
                                <div>
                                    <button v-if="role === 'admin'" class="change"
                                        @click="editMenuItem(child.id, true, item.id)">Edit</button>
                                    <button v-if="role === 'admin'" class="buttonChild"
                                        @click="addSubChild(item.id, child.id)">+</button>
                                </div>
                                <h5>{{ child.name }}</h5>
                                <button v-if="role === 'admin'" class="close"
                                    @click="deleteMenuItem(child.id, true, item.id)">X</button>
                            </div>
                            <transition name="slide-fade">
                                <ul class="menuEditor__wrapper_items-underMenu"
                                    v-if="item.isActive && child.children && child.children.length">
                                    <li class="sectionGap__parent_child sectionGap__parent_childSecond"
                                        :class="{ 'sectionGap__parent_child-forUsers': role !== 'admin' }"
                                        v-for="subChild in child.children" :key="subChild.id">
                                        <button v-if="role === 'admin'" class="change"
                                            @click="editMenuItem(subChild.id, true, item.id, true, child.id)">Edit</button>
                                        <h5>{{ subChild.name }}</h5>
                                        <button v-if="role === 'admin'" class="close"
                                            @click="deleteMenuItem(subChild.id, true, item.id, true, child.id)">X</button>
                                    </li>
                                </ul>
                            </transition>
                        </li>
                    </ul>
                </transition>
            </li>
        </transition-group>
    </section>
</template>
