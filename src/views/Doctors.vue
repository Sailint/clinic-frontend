<template>
    <div class="container mx-auto p-4">
        <h1 class="text-3xl font-bold mb-4">Врачи</h1>
        <div v-if="isAdmin" class="mb-4">
            <button @click="showForm = true" class="bg-blue-600 text-white px-4 py-2 rounded">Добавить врача</button>
        </div>
        <Table>
            <template #header>
                <tr>
                    <th class="border p-2">ID</th>
                    <th class="border p-2">Имя</th>
                    <th class="border p-2">Фамилия</th>
                    <th class="border p-2">Фото</th>
                    <th class="border p-2">Действия</th>
                </tr>
            </template>
            <template #body>
                <tr v-for="doctor in doctors" :key="doctor.id">
                    <td class="border p-2">{{ doctor.id }}</td>
                    <td class="border p-2">{{ doctor.name }}</td>
                    <td class="border p-2">{{ doctor.surname }}</td>
                    <td class="border p-2">
                        <img :src="doctor.photo" alt="Doctor photo" class="w-16 h-16 object-cover" />
                    </td>
                    <td class="border p-2">
                        <button @click="viewDoctor(doctor)"
                            class="bg-green-500 text-white px-2 py-1 rounded mr-2">Просмотр</button>
                        <button v-if="isAdmin" @click="editDoctor(doctor)"
                            class="bg-yellow-500 text-white px-2 py-1 rounded mr-2">Редактировать</button>
                        <button v-if="isAdmin" @click="deleteDoctor(doctor.id)"
                            class="bg-red-500 text-white px-2 py-1 rounded">Удалить</button>
                    </td>
                </tr>
            </template>
        </Table>
        <!-- Новая пагинация -->
        <div class="mt-4 flex justify-center items-center space-x-2">
            <button :disabled="currentPage === 1" @click="currentPage = 1"
                class="px-3 py-1 bg-gray-300 rounded disabled:opacity-50">
                В начало
            </button>
            <button :disabled="currentPage === 1" @click="currentPage--"
                class="px-3 py-1 bg-gray-300 rounded disabled:opacity-50">
                Назад
            </button>
            <button v-for="page in displayedPages" :key="page" @click="currentPage = page" :class="[
                'px-3 py-1 rounded',
                currentPage === page ? 'bg-blue-600 text-white' : 'bg-gray-300'
            ]">
                {{ page }}
            </button>
            <button :disabled="currentPage === totalPages" @click="currentPage++"
                class="px-3 py-1 bg-gray-300 rounded disabled:opacity-50">
                Вперед
            </button>
            <button :disabled="currentPage === totalPages" @click="currentPage = totalPages"
                class="px-3 py-1 bg-gray-300 rounded disabled:opacity-50">
                В конец
            </button>
        </div>
        <!-- Форма добавления/редактирования -->
        <div v-if="showForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div class="bg-white p-6 rounded max-w-lg w-full">
                <h2 class="text-xl font-bold mb-4">{{ form.id ? 'Редактировать врача' : 'Добавить врача' }}</h2>
                <form @submit.prevent="saveDoctor">
                    <div class="grid grid-cols-1 gap-4">
                        <input v-model="form.name" type="text" placeholder="Имя" class="border p-2 rounded" required />
                        <input v-model="form.surname" type="text" placeholder="Фамилия" class="border p-2 rounded"
                            required />
                        <input v-model="form.specialization" type="text" placeholder="Специализация"
                            class="border p-2 rounded" required />
                        <input v-model="form.experience" type="number" placeholder="Стаж" class="border p-2 rounded"
                            required />
                        <input v-model="form.email" type="email" placeholder="Email" class="border p-2 rounded"
                            required />
                        <input v-model="form.phone" type="text" placeholder="Телефон" class="border p-2 rounded" />
                        <input type="file" @change="handleFileChange" class="border p-2 rounded" accept="image/*" />
                        <textarea v-model="form.info" placeholder="Информация" class="border p-2 rounded"></textarea>
                        <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded">Сохранить</button>
                    </div>
                </form>
                <button @click="showForm = false" class="mt-4 bg-gray-500 text-white px-4 py-2 rounded">
                    Отмена
                </button>
            </div>
        </div>
        <!-- Модальное окно просмотра -->
        <div v-if="showView" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div class="bg-white p-6 rounded max-w-lg w-full">
                <h2 class="text-xl font-bold mb-4">Просмотр врача</h2>
                <div class="grid grid-cols-1 gap-4">
                    <p><strong>ID:</strong> {{ viewDoctorData.id }}</p>
                    <p><strong>Имя:</strong> {{ viewDoctorData.name }}</p>
                    <p><strong>Фамилия:</strong> {{ viewDoctorData.surname }}</p>
                    <p><strong>Специализация:</strong> {{ viewDoctorData.specialization }}</p>
                    <p><strong>Стаж:</strong> {{ viewDoctorData.experience }} лет</p>
                    <p><strong>Email:</strong> {{ viewDoctorData.email }}</p>
                    <p><strong>Телефон:</strong> {{ viewDoctorData.phone || 'Не указан' }}</p>
                    <p><strong>Информация:</strong> {{ viewDoctorData.info || 'Не указана' }}</p>
                    <img :src="viewDoctorData.photo" alt="Doctor photo" class="w-32 h-32 object-cover rounded" />
                </div>
                <button @click="showView = false" class="mt-4 bg-gray-500 text-white px-4 py-2 rounded">
                    Закрыть
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed, watch } from 'vue';
import { useStore } from 'vuex';
import axios from 'axios';
import Table from '../components/Table.vue';

export default {
    components: { Table },
    setup() {
        const store = useStore();
        const doctors = ref([]);
        const currentPage = ref(1);
        const limit = 10;
        const total = ref(0);
        const showForm = ref(false);
        const showView = ref(false);
        const viewDoctorData = ref({});
        const form = ref({
            id: null,
            name: '',
            surname: '',
            specialization: '',
            experience: '',
            email: '',
            phone: '',
            photo: null,
            info: ''
        });
        const file = ref(null);

        const isAdmin = computed(() => store.getters.userRole === 'admin');
        const totalPages = computed(() => Math.ceil(total.value / limit));

        // Вычисление отображаемых страниц
        const displayedPages = computed(() => {
            const maxPagesToShow = 5;
            const pages = [];
            const half = Math.floor(maxPagesToShow / 2);
            let start = Math.max(1, currentPage.value - half);
            let end = Math.min(totalPages.value, start + maxPagesToShow - 1);

            if (end - start + 1 < maxPagesToShow) {
                start = Math.max(1, end - maxPagesToShow + 1);
            }

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }
            return pages;
        });

        const fetchDoctors = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/doctors?page=${currentPage.value}&limit=${limit}`);
                doctors.value = response.data.doctors;
                total.value = response.data.total;
            } catch (error) {
                console.error('Failed to fetch doctors:', error);
            }
        };

        const saveDoctor = async () => {
            const formData = new FormData();
            formData.append('name', form.value.name);
            formData.append('surname', form.value.surname);
            formData.append('specialization', form.value.specialization);
            formData.append('experience', form.value.experience);
            formData.append('email', form.value.email);
            formData.append('phone', form.value.phone);
            formData.append('info', form.value.info);
            if (file.value) {
                console.log('Uploading new photo:', file.value.name);
                formData.append('photo', file.value);
            } else if (form.value.photo) {
                console.log('Using existing photo:', form.value.photo);
                formData.append('photo', form.value.photo);
            } else {
                console.log('No photo provided, using default');
            }

            try {
                if (form.value.id) {
                    console.log('Updating doctor:', form.value.id);
                    await axios.put(`${import.meta.env.VITE_API_URL}/api/doctors/${form.value.id}`, formData);
                } else {
                    console.log('Adding new doctor');
                    await axios.post(`${import.meta.env.VITE_API_URL}/api/doctors`, formData);
                }
                fetchDoctors();
                resetForm();
            } catch (error) {
                console.error('Failed to save doctor:', error.response?.data || error.message);
            }
        };

        const editDoctor = (doctor) => {
            form.value = { ...doctor };
            file.value = null;
            showForm.value = true;
        };

        const deleteDoctor = async (id) => {
            if (confirm('Удалить врача?')) {
                try {
                    await axios.delete(`${import.meta.env.VITE_API_URL}/api/doctors/${id}`);
                    fetchDoctors();
                } catch (error) {
                    console.error('Failed to delete doctor:', error);
                }
            }
        };

        const viewDoctor = (doctor) => {
            viewDoctorData.value = { ...doctor };
            showView.value = true;
        };

        const resetForm = () => {
            form.value = {
                id: null,
                name: '',
                surname: '',
                specialization: '',
                experience: '',
                email: '',
                phone: '',
                photo: null,
                info: ''
            };
            file.value = null;
            showForm.value = false;
        };

        const handleFileChange = (event) => {
            file.value = event.target.files[0];
        };

        watch(currentPage, fetchDoctors, { immediate: true });

        return {
            doctors,
            currentPage,
            totalPages,
            displayedPages,
            showForm,
            showView,
            viewDoctor,
            viewDoctorData,
            form,
            isAdmin,
            saveDoctor,
            editDoctor,
            deleteDoctor,
            viewDoctor,
            handleFileChange
        };
    }
};
</script>