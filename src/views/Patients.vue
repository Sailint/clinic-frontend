<template>
    <div class="container mx-auto p-4">
        <h1 class="text-3xl font-bold mb-4">Пациенты</h1>
        <div v-if="isAdmin" class="mb-4">
            <button @click="showForm = true" class="bg-blue-600 text-white px-4 py-2 rounded">Добавить пациента</button>
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
                <tr v-for="patient in patients" :key="patient.id">
                    <td class="border p-2">{{ patient.id }}</td>
                    <td class="border p-2">{{ patient.name }}</td>
                    <td class="border p-2">{{ patient.surname }}</td>
                    <td class="border p-2">
                        <img :src="patient.photo" alt="Patient photo" class="w-16 h-16 object-cover" />
                    </td>
                    <td class="border p-2">
                        <button @click="viewPatient(patient)"
                            class="bg-green-500 text-white px-2 py-1 rounded mr-2">Просмотр</button>
                        <button v-if="isAdmin" @click="editPatient(patient)"
                            class="bg-yellow-500 text-white px-2 py-1 rounded mr-2">Редактировать</button>
                        <button v-if="isAdmin" @click="deletePatient(patient.id)"
                            class="bg-red-500 text-white px-2 py-1 rounded">Удалить</button>
                    </td>
                </tr>
            </template>
        </Table>
        <!-- Пагинация -->
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
                <h2 class="text-xl font-bold mb-4">{{ form.id ? 'Редактировать пациента' : 'Добавить пациента' }}</h2>
                <form @submit.prevent="savePatient">
                    <div class="grid grid-cols-1 gap-4">
                        <input v-model="form.name" type="text" placeholder="Имя" class="border p-2 rounded" required />
                        <input v-model="form.surname" type="text" placeholder="Фамилия" class="border p-2 rounded"
                            required />
                        <input v-model="form.birth_date" type="date" placeholder="Дата рождения"
                            class="border p-2 rounded" required />
                        <select v-model="form.gender" class="border p-2 rounded" required>
                            <option value="male">Мужской</option>
                            <option value="female">Женский</option>
                            <option value="other">Другое</option>
                        </select>
                        <input v-model="form.address" type="text" placeholder="Адрес" class="border p-2 rounded" />
                        <input v-model="form.phone" type="text" placeholder="Телефон" class="border p-2 rounded" />
                        <input type="file" @change="handleFileChange" class="border p-2 rounded" accept="image/*" />
                        <textarea v-model="form.medical_history" placeholder="Медицинская история"
                            class="border p-2 rounded"></textarea>
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
                <h2 class="text-xl font-bold mb-4">Просмотр пациента</h2>
                <div class="grid grid-cols-1 gap-4">
                    <p><strong>ID:</strong> {{ viewPatientData.id }}</p>
                    <p><strong>Имя:</strong> {{ viewPatientData.name }}</p>
                    <p><strong>Фамилия:</strong> {{ viewPatientData.surname }}</p>
                    <p><strong>Дата рождения:</strong> {{ viewPatientData.birth_date }}</p>
                    <p><strong>Пол:</strong> {{ viewPatientData.gender }}</p>
                    <p><strong>Адрес:</strong> {{ viewPatientData.address || 'Не указан' }}</p>
                    <p><strong>Телефон:</strong> {{ viewPatientData.phone || 'Не указан' }}</p>
                    <p><strong>Медицинская история:</strong> {{ viewPatientData.medical_history || 'Не указана' }}</p>
                    <img :src="viewPatientData.photo" alt="Patient photo" class="w-32 h-32 object-cover rounded" />
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
        const patients = ref([]);
        const currentPage = ref(1);
        const limit = 10;
        const total = ref(0);
        const showForm = ref(false);
        const showView = ref(false);
        const viewPatientData = ref({});
        const form = ref({
            id: null,
            name: '',
            surname: '',
            birth_date: '',
            gender: '',
            address: '',
            phone: '',
            photo: null,
            medical_history: ''
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

        const apiUrl = import.meta.env.VITE_API_URL;
        console.log('API URL:', apiUrl);

        const fetchPatients = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/patients?page=${currentPage.value}&limit=${limit}`);
                console.log('Fetched patients:', response.data.patients);
                patients.value = response.data.patients;
                total.value = response.data.total;
            } catch (error) {
                console.error('Failed to fetch patients:', error);
            }
        };

        const savePatient = async () => {
            const formData = new FormData();
            formData.append('name', form.value.name);
            formData.append('surname', form.value.surname);
            formData.append('birth_date', form.value.birth_date);
            formData.append('gender', form.value.gender);
            formData.append('address', form.value.address);
            formData.append('phone', form.value.phone);
            formData.append('medical_history', form.value.medical_history);
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
                    console.log('Updating patient:', form.value.id);
                    await axios.put(`${apiUrl}/api/patients/${form.value.id}`, formData);
                } else {
                    console.log('Adding new patient');
                    await axios.post(`${apiUrl}/api/patients`, formData);
                }
                fetchPatients();
                resetForm();
            } catch (error) {
                console.error('Failed to save patient:', error.response?.data || error.message);
            }
        };

        const editPatient = (patient) => {
            form.value = { ...patient };
            file.value = null;
            showForm.value = true;
        };

        const deletePatient = async (id) => {
            if (confirm('Удалить пациента?')) {
                try {
                    await axios.delete(`${apiUrl}/api/patients/${id}`);
                    fetchPatients();
                } catch (error) {
                    console.error('Failed to delete patient:', error);
                }
            }
        };

        const viewPatient = (patient) => {
            viewPatientData.value = { ...patient };
            showView.value = true;
        };

        const resetForm = () => {
            form.value = {
                id: null,
                name: '',
                surname: '',
                birth_date: '',
                gender: '',
                address: '',
                phone: '',
                photo: null,
                medical_history: ''
            };
            file.value = null;
            showForm.value = false;
        };

        const handleFileChange = (event) => {
            file.value = event.target.files[0];
        };

        watch(currentPage, fetchPatients, { immediate: true });

        return {
            patients,
            currentPage,
            totalPages,
            displayedPages,
            showForm,
            showView,
            viewPatient,
            viewPatientData,
            form,
            isAdmin,
            savePatient,
            editPatient,
            deletePatient,
            viewPatient,
            handleFileChange
        };
    }
};
</script>