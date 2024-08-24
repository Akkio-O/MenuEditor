<script>
import { mapGetters } from 'vuex';
export default {
    data() {
        return {
            newName: '',
            newUnderName: '',
            newPlaceholderParent: "Название меню",
            newPlaceholderChild: "Название подменю",
            menu: [
                {
                    id: 1,
                    name: 'Главная',
                    isActive: false,
                    children: [
                        {
                            id: 2,
                            name: 'Команда',
                            isActive: false,
                            children: []
                        }
                    ]
                },
                {
                    id: 3,
                    name: 'О нас',
                    isActive: false,
                    children: [
                        {
                            id: 4,
                            name: 'Команда',
                            isActive: false,
                            children: []
                        },
                        {
                            id: 5,
                            name: 'Контакты',
                            isActive: false,
                            children: []
                        },
                        {
                            id: 6,
                            name: 'Документация',
                            isActive: false,
                            children: []
                        }
                    ]
                }
            ],
            nextId: 7,
            activeItemId: null
        };
    },
    computed: {
        ...mapGetters(['isAuthenticated']),
        ...mapGetters(['currentRole']),
    },
    methods: {
        toggleActive(id) {
            this.activeItemId = this.activeItemId === id ? null : id;
            this.menu = this.menu.map(item => {
                item.isActive = item.id === this.activeItemId
                return item;
            });
        },
        handleClickOutside(event) {
            const menuElement = this.$refs.menuWrapper;
            if (menuElement && !menuElement.contains(event.target)) {
                this.menu = this.menu.map(item => {
                    item.isActive = false;
                    return item;
                });
                this.activeItemId = null;
            }
        },
        addMenuItem(parentId = null) {
            const newItem = {
                id: this.nextId++,
                name: this.newName,
                children: []
            };
            const newUnderItem = {
                id: this.nextId++,
                name: this.newUnderName,
                children: []
            };
            if (this.newName !== '' && parentId === null) {
                this.menu.push(newItem);
                this.newName = '';
                this.newPlaceholderParent = 'Название меню';
            } else if (this.newUnderName !== '' && parentId !== null) {
                this.menu = this.menu.map(item => {
                    if (item.children && item.id === parentId) {
                        item.children.push(newUnderItem)
                        this.newUnderName = '';
                        this.newPlaceholderChild = 'Название подменю';
                    }
                    return item;
                });
            }

        },
        editMenuItem(id, isChild = false, parentId = null) {
            if (this.newName !== '') {
                this.menu = this.menu.map(item => {
                    if (item.id === id && !isChild) {
                        item.name = this.newName;
                    }
                    return item;
                });
            }
            if (this.newUnderName !== '') {
                this.menu = this.menu.map(item => {
                    if (isChild && item.id === parentId) {
                        item.children = item.children.map(child => {
                            if (child.id === id) {
                                child.name = this.newUnderName;
                            }
                            return child;
                        });
                    }
                    return item;
                });
            }
        },
        deleteMenuItem(id, isChild = false, parentId = null) {
            if (isChild) {
                this.menu = this.menu.map(item => {
                    if (item.id === parentId) {
                        item.children = item.children.filter(child => child.id !== id);
                    }
                    return item;
                });
            } else {
                this.menu = this.menu.filter(item => item.id !== id);
            }
        }
    },
    mounted() {
        window.addEventListener('click', this.handleClickOutside);
    },
}
</script>

<template>
    <section class="menuEditor" ref="menuWrapper">
        <h1>Редактор меню</h1>
        <div v-if="currentRole === 'admin'" class="sectionGap">
            <input type="text" v-model="newName" :placeholder="newPlaceholderParent">
            <input type="text" v-model="newUnderName" :placeholder="newPlaceholderChild">
            <button @click="addMenuItem()">Добавить</button>
        </div>
        <transition-group name="slide-fade" tag="ul" class="menuEditor__wrapper">
            <li class="sectionGap menuEditor__wrapper_items" v-for="item in menu" :key="item.id"
                :class="{ 'menuEditor__wrapper_items-active': item.isActive }">
                <div v-if="currentRole === 'admin'" class="sectionGap__parent menuEditor__wrapper_items-parent">
                    <button class="change" @click="editMenuItem(item.id)">Изменить</button>
                    <button class="buttonChild" @click="addMenuItem(item.id)">Добавить</button>
                    <button class="close" @click="deleteMenuItem(item.id)">X</button>
                </div>
                <h3 @click="toggleActive(item.id)">{{ item.name }}</h3>
                <transition name="slide-fade">
                    <ul class="menuEditor__wrapper_items-underMenu" v-if="item.isActive && item.children.length">
                        <li class="sectionGap__parent_child" v-for="child in item.children" :key="child.id">
                            <button v-if="currentRole === 'admin'" class="change" @click="editMenuItem(child.id, true, item.id)">Изменить</button>
                            <h5>{{ child.name }}</h5>
                            <button v-if="currentRole === 'admin'" class="close" @click="deleteMenuItem(child.id, true, item.id)">X</button>
                        </li>
                    </ul>
                </transition>
            </li>
        </transition-group>
    </section>
</template>