<template>
	<li class="menuEditor__wrapper_items-item" @mouseenter="emitToggleActive(true)"
		@mouseleave="emitToggleActive(false)">
		<div class="menuEditor__wrapper_items-item--main">
			<div class="menuEditor__wrapper_items-item--mainSubMain">
				<button v-if="role === 'admin'" class="change" @click="emitEditMenuItem">Edit</button>
				<button v-if="role === 'admin'" class="buttonChild" @click="emitAddMenuItem">+</button>
			</div>
			<router-link :to="'/'"><button>{{ item.title }}</button></router-link>
			<button v-if="role === 'admin'" class="close" @click="emitDeleteMenuItem">X</button>
		</div>
		<ul v-if="item.isActive && item.child" class="menuEditor__wrapper_items-item--submain">
			<recursive-menu-item v-for="child in item.child" :key="child.id" :item="child" :role="role"
				@toggle-active="$emit('toggle-active', $event)" @edit-item="$emit('edit-item', $event)"
				@delete-item="$emit('delete-item', $event)" @add-menu-item="$emit('add-menu-item', $event)"
				@click-breadcrumb="handleClick(child)" />
		</ul>
	</li>
</template>

<script>
export default {
	name: 'RecursiveMenuItem',
	props: {
		item: {
			type: Object,
			required: true
		},
		role: String,
		breadcrumbPath: Array,
	},
	methods: {
		handleClick(item) {
			const path = this.getBreadcrumbPath(item);
			this.$emit('click-breadcrumb', path);
		},
		getBreadcrumbPath(item) {
			let path = [];
			if (item.parent && item.parentId !== null) {
				path = this.getBreadcrumbPath(item.parent);
			}
			path.push(item.title);
			return path;
		},
		emitToggleActive(isActive) {
			this.$emit('toggle-active', this.item.id, isActive);
		},
		emitEditMenuItem() {
			this.$emit('edit-item', this.item.id);
		},
		emitDeleteMenuItem() {
			this.$emit('delete-item', this.item.id);
		},
		emitAddMenuItem() {
			this.$emit('add-menu-item', this.item.id);
		}
	}
};
</script>
