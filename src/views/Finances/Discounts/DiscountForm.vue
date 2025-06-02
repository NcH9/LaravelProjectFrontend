<template>
    <el-form>
        <el-form-item label="Name">
            <el-input
                type="text"
                v-model="form.name"
            />
        </el-form-item>
        <el-form-item label="Percent">
            <el-input-number
                v-model="form.percent"
                :min="0"
                :max="100"
            />
        </el-form-item>
        <el-form-item label="Seasonal">
            <el-checkbox
                v-model="form.is_seasonal"
            />
        </el-form-item>
        <el-form-item label="Loyalty Reward">
            <el-checkbox
                v-model="form.loyalty_reward"
            />
        </el-form-item>
        <el-form-item>
            <el-button
                @click="saveDiscount"
                :disabled="isSaving"
            >
                Save
            </el-button>
        </el-form-item>
    </el-form>
</template>

<script setup>
import {ref} from "vue";
import {discountService} from "@/services/discount.service.js";
import {useRouter} from "vue-router";

const props = defineProps({
    discount: {
        required: false,
        type: Object,
    }
})

const form = ref({
    name: props.discount?.name ?? '',
    percent: Number(props.discount?.percent ?? 0),
    is_seasonal: Boolean(props.discount?.is_seasonal ?? true),
    loyalty_reward: Boolean(props.discount?.loyalty_reward ?? false)
});
const
    isSaving = ref(false),
    router = useRouter();
const saveDiscount = async () => {
    isSaving.value = true;
    try {
        props.discount === undefined
            ? await discountService.createDiscount(form.value)
            : await discountService.updateDiscount(props.discount.id, form.value);

        router.go(0);
    } catch (error) {
        console.log(error)
    } finally {
        isSaving.value = false;
    }
};

</script>

<style scoped>

</style>