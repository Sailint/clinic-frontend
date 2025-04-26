<template>
    <div class="container mx-auto p-6 bg-gray-50 min-h-screen">
        <!-- Hero Section -->
        <section class="text-center mb-12">
            <h1 class="text-4xl md:text-5xl font-extrabold text-blue-800 mb-4 animate__animated animate__fadeIn">
                Добро пожаловать в нашу поликлинику
            </h1>
            <p class="text-lg md:text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
                Мы предоставляем качественные медицинские услуги с заботой о вашем здоровье.
            </p>
        </section>

        <!-- Image Gallery -->
        <section class="mb-12">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div v-for="(image, index) in images" :key="index"
                    class="relative overflow-hidden rounded-lg shadow-lg group">
                    <img :src="image.src" :alt="image.alt"
                        class="w-full h-64 object-cover transform group-hover:scale-105 transition duration-500" />
                    <div
                        class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition duration-500">
                    </div>
                </div>
            </div>
        </section>

        <!-- Services Section -->
        <section class="bg-white p-8 rounded-lg shadow-md">
            <h2 class="text-3xl font-bold text-gray-800 mb-6 text-center">Наши услуги</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div v-for="service in services" :key="service.title" class="text-center">
                    <div class="text-blue-600 text-4xl mb-4">{{ service.icon }}</div>
                    <h3 class="text-xl font-semibold text-gray-800 mb-2">{{ service.title }}</h3>
                    <p class="text-gray-600">{{ service.description }}</p>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
export default {
    data() {
        return {
            images: [
                { src: '/images/home1.jpg', alt: 'Clinic 1' },
                { src: '/images/home2.jpg', alt: 'Clinic 2' },
                { src: '/images/home3.jpg', alt: 'Clinic 3' },
            ],
            services: [
                {
                    icon: '🏥',
                    title: 'Терапия',
                    description: 'Консультации и лечение у опытных терапевтов.'
                },
                {
                    icon: '❤️',
                    title: 'Кардиология',
                    description: 'Диагностика и лечение сердечно-сосудистых заболеваний.'
                },
                {
                    icon: '🩺',
                    title: 'Диагностика',
                    description: 'Современное оборудование для точной диагностики.'
                },
            ],
        };
    },
};
</script>

<style scoped>
@import 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css';
</style>