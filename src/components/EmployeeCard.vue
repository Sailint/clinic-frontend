<template>
    <div
        class="employee-card bg-white border rounded-lg p-6 flex flex-col items-center shadow-md hover:shadow-lg transition-shadow duration-300">
        <div class="photo-container mb-42rem w-full">
            <img :src="photo" :alt="name" class="w-full h-full object-contain" />
        </div>
        <h3 class="text-lg font-semibold text-gray-800 mt-4">{{ name }}</h3>
        <p class="text-gray-600">{{ position }}</p>
        <p class="text-blue-600">{{ phone }}</p>
    </div>
</template>

<script>
export default {
    props: {
        name: String,
        position: String,
        phone: String,
        photo: String
    }
};
</script>

<style scoped>
.photo-container {
    width: 192px;
    /* Larger size for images */
    height: 192px;
    overflow: hidden;
    border-radius: 0.5rem;
    /* Matches Tailwind's rounded-lg */
}
</style>