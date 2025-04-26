<template>
    <div class="container mx-auto p-6 bg-gray-50 min-h-screen">
        <!-- Header Section -->
        <section class="text-center mb-12">
            <h1 class="text-4xl md:text-5xl font-extrabold text-blue-800 mb-4 animate__animated animate__fadeIn">
                Свяжитесь с нами
            </h1>
            <p class="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                Наши сотрудники готовы ответить на ваши вопросы и помочь с записью на прием.
            </p>
        </section>

        <!-- Employee Cards -->
        <section class="mb-12">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <EmployeeCard v-for="employee in employees" :key="employee.id" :name="employee.name"
                    :position="employee.position" :phone="employee.phone" :photo="employee.photo"
                    class="transform hover:scale-105 transition duration-300" />
            </div>
        </section>

        <!-- Contact Information -->
        <section class="bg-white p-8 rounded-lg shadow-md text-center">
            <h2 class="text-3xl font-bold text-gray-800 mb-6">Дополнительная информация</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <h3 class="text-xl font-semibold text-gray-800 mb-2">Адрес</h3>
                    <p class="text-gray-600">ул. Здоровья, 123, Москва</p>
                </div>
                <div>
                    <h3 class="text-xl font-semibold text-gray-800 mb-2">Часы работы</h3>
                    <p class="text-gray-600">Пн-Пт: 8:00–20:00<br>Сб: 9:00–15:00</p>
                </div>
                <div>
                    <h3 class="text-xl font-semibold text-gray-800 mb-2">Общий контакт</h3>
                    <p class="text-gray-600">+7 (999) 000-00-00<br>info@clinic.ru</p>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
import EmployeeCard from '../components/EmployeeCard.vue';

export default {
    components: { EmployeeCard },
    data() {
        return {
            employees: [
                {
                    id: 1,
                    name: 'Иван Иванов',
                    position: 'Главный врач',
                    phone: '+79990000001',
                    photo: '/images/doctor1.jpg'
                },
                {
                    id: 2,
                    name: 'Михаил Петров',
                    position: 'Администратор',
                    phone: '+79990000002',
                    photo: '/images/doctor2.jpg'
                },
                {
                    id: 3,
                    name: 'Анна Смирнова',
                    position: 'Терапевт',
                    phone: '+79990000003',
                    photo: '/images/doctor3.jpg'
                },
                {
                    id: 4,
                    name: 'Сергей Федоров',
                    position: 'Медсестра',
                    phone: '+79990000004',
                    photo: '/images/doctor4.jpg'
                },
                {
                    id: 5,
                    name: 'Ольга Васильева',
                    position: 'Кардиолог',
                    phone: '+79990000005',
                    photo: '/images/doctor5.jpg'
                },
                {
                    id: 6,
                    name: 'Елена Кузнецова',
                    position: 'Хирург',
                    phone: '+79990000006',
                    photo: '/images/doctor6.jpg'
                }
            ]
        };
    }
};
</script>

<style scoped>
@import 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css';
</style>