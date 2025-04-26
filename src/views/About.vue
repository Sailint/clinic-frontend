<template>
    <div class="container mx-auto p-6 bg-gray-50 min-h-screen">
        <!-- Header Section -->
        <section class="text-center mb-12">
            <h1 class="text-4xl md:text-5xl font-extrabold text-blue-800 mb-4 animate__animated animate__fadeIn">
                О нашей поликлинике
            </h1>
            <p class="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                Наша поликлиника — это современное медицинское учреждение с опытными специалистами, передовым
                оборудованием и индивидуальным подходом к каждому пациенту.
            </p>
        </section>

        <!-- Image Gallery -->
        <section class="mb-12">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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

        <!-- Mission and Vision -->
        <section class="bg-white p-8 rounded-lg shadow-md mb-12">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h2 class="text-2xl font-bold text-gray-800 mb-4">Наша миссия</h2>
                    <p class="text-gray-600">
                        Обеспечивать доступ к высококачественной медицинской помощи, сочетая профессионализм и заботу о
                        пациенте.
                    </p>
                </div>
                <div>
                    <h2 class="text-2xl font-bold text-gray-800 mb-4">Наше видение</h2>
                    <p class="text-gray-600">
                        Стать ведущим медицинским центром, который задает стандарты в области здравоохранения.
                    </p>
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
                { src: '/images/about1.jpg', alt: 'About 1' },
                { src: '/images/about2.jpg', alt: 'About 2' },
                { src: '/images/about3.jpg', alt: 'About 3' },
                { src: '/images/about4.jpg', alt: 'About 4' },
            ],
        };
    },
};
</script>

<style scoped>
@import 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css';
</style>