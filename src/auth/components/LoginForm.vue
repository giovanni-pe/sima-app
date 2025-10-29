<script setup lang="ts">
import { reactive, ref, computed } from 'vue';
import { isValidEmail, isValidPhone } from '@/lib/utils';
import { useAuthStore } from '@/auth/stores/auth';
import Button from '@/ui/Button.vue';
import type { LoginCredentials } from '../types';
import { Icon } from '@iconify/vue';

const auth = useAuthStore();

// ------ State ------
const fieldErrors = reactive<Record<string, string>>({});
const formData = reactive({
  login: '',
  password: ''
});
const showPassword = ref(false);
const capsLockOn = ref(false);
const isFocused = reactive({ login: false, password: false });

// ------ Derivados UI ------
const isEmail = computed(() => formData.login.includes('@'));
const loginIcon = computed<string>(() => {
  if (!formData.login.trim()) return 'mdi:account-outline';
  return isEmail.value ? 'mdi:email-outline' : 'mdi:phone';
});
const loginInputType = computed<'email' | 'text'>(() => (isEmail.value ? 'email' : 'text'));
const loginInputMode = computed<'email' | 'numeric' | 'text'>(() =>
  isEmail.value ? 'email' : 'numeric'
);
const passwordType = computed(() => (showPassword.value ? 'text' : 'password'));

// ------ Validación ------
function validateForm() {
  const errors: Record<string, string> = {};

  if (!formData.login.trim()) {
    errors.login = 'Ingresa tu teléfono o email';
  } else {
    if (isEmail.value && !isValidEmail(formData.login)) {
      errors.login = 'Email inválido';
    } else if (!isEmail.value && !isValidPhone(formData.login)) {
      errors.login = 'Teléfono inválido (9 dígitos)';
    }
  }

  if (!formData.password) {
    errors.password = 'Ingresa tu contraseña';
  } else if (formData.password.length < 6) {
    errors.password = 'Mínimo 6 caracteres';
  }

  Object.assign(fieldErrors, errors);
  return Object.keys(errors).length === 0;
}

async function handleSubmit(e: Event) {
  e.preventDefault();
  if (!validateForm()) return;
  try {
    await auth.login({ ...formData });
  } catch {
    // error ya manejado por el store
  }
}

function clearFieldError(key: keyof LoginCredentials) {
  if (fieldErrors[key]) fieldErrors[key] = '';
}

function onKeyDown(e: KeyboardEvent) {
  capsLockOn.value = e.getModifierState && e.getModifierState('CapsLock');
}
</script>

<template>
  <section
    class="relative min-h-screen grid place-items-center overflow-hidden bg-gradient-to-br from-cyan-50 via-sky-50 to-cyan-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900"
    aria-busy="false"
  >
    <!-- Fondo animado con elementos de arroz -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
      <!-- Gradientes celestes -->
      <div class="absolute top-0 left-0 w-[800px] h-[800px] bg-cyan-400/20 rounded-full blur-3xl animate-pulse-slow"></div>
      <div class="absolute bottom-0 right-0 w-[600px] h-[600px] bg-sky-400/20 rounded-full blur-3xl animate-pulse-slower"></div>
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-cyan-300/15 rounded-full blur-3xl"></div>
      
      <!-- Patrón de grilla sutil -->
      <div class="absolute inset-0 opacity-[0.03]" style="background-image: linear-gradient(rgba(6, 182, 212, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.5) 1px, transparent 1px); background-size: 40px 40px;"></div>
    </div>

    <!-- Decoración flotante: solo hoja verde -->
    <div class="absolute inset-0 pointer-events-none">
      <div class="absolute top-[15%] left-[10%] animate-float">
        <div class="w-12 h-12 rounded-2xl bg-green-500/10 backdrop-blur-sm border border-green-500/20 grid place-items-center rotate-12">
          <Icon icon="mdi:leaf" class="w-6 h-6 text-green-600" />
        </div>
      </div>
      <div class="absolute top-[25%] right-[15%] animate-float-delayed">
        <div class="w-14 h-14 rounded-2xl bg-cyan-500/10 backdrop-blur-sm border border-cyan-500/20 grid place-items-center -rotate-6">
          <Icon icon="mdi:water" class="w-7 h-7 text-cyan-600" />
        </div>
      </div>
      <div class="absolute bottom-[20%] left-[15%] animate-float-slow">
        <div class="w-10 h-10 rounded-2xl bg-amber-500/10 backdrop-blur-sm border border-amber-500/20 grid place-items-center rotate-6">
          <Icon icon="mdi:white-balance-sunny" class="w-5 h-5 text-amber-600" />
        </div>
      </div>
      <div class="absolute bottom-[30%] right-[12%] animate-float">
        <div class="w-12 h-12 rounded-2xl bg-cyan-500/10 backdrop-blur-sm border border-cyan-500/20 grid place-items-center -rotate-12">
          <Icon icon="mdi:thermometer" class="w-6 h-6 text-cyan-600" />
        </div>
      </div>
    </div>

    <!-- Panel principal -->
    <div
      class="relative z-10 w-full max-w-md mx-4 animate-slide-up"
    >
      <!-- Card con glassmorphism -->
      <div class="relative rounded-3xl border border-white/40 shadow-2xl backdrop-blur-2xl bg-white/70 dark:bg-slate-900/60 overflow-hidden">
        <!-- Borde brillante superior -->
        <div class="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"></div>
        
        <!-- Header mejorado -->
        <header class="px-8 pt-8 pb-6 relative">
          <!-- Logo con efecto de profundidad - solo hoja verde -->
          <div class="flex items-center gap-4 mb-3">
            <div class="relative group">
              <div class="absolute inset-0 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl blur-lg opacity-60 group-hover:opacity-80 transition-opacity"></div>
              <div class="relative size-14 rounded-3xl bg-gradient-to-br from-green-500 to-green-600 grid place-items-center shadow-lg transform group-hover:scale-105 transition-transform">
                <Icon icon="mdi:leaf" class="w-8 h-8 text-white" />
              </div>
            </div>
            <div>
              <h1 class="text-2xl font-bold tracking-tight bg-gradient-to-r from-cyan-700 to-sky-700 bg-clip-text text-transparent">
                SIMA-UNAS
              </h1>
              <p class="text-sm text-slate-600 dark:text-slate-400 font-medium">
                Sistema de Monitoreo Agricola
              </p>
            </div>
          </div>
          
          <!-- Descripción contextual -->
          <div class="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-cyan-50/80 dark:bg-cyan-950/30 border border-cyan-200/50 dark:border-cyan-800/50">
            <Icon icon="mdi:rice" class="w-5 h-5 text-cyan-600 dark:text-cyan-400 flex-shrink-0" />
            <p class="text-xs text-cyan-800 dark:text-cyan-300 leading-relaxed">
              Monitoreo en tiempo real de cultivos de arroz
            </p>
          </div>
        </header>

        <!-- Form -->
        <form @submit="handleSubmit" class="px-8 pb-8 space-y-5" @keydown="onKeyDown">
          <!-- Login field -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Teléfono o Email
            </label>
            <div
              class="relative group"
              :class="[
                'transition-all duration-300',
                fieldErrors.login ? 'scale-[0.99]' : ''
              ]"
            >
              <!-- Icono con animación -->
              <div
                class="absolute inset-y-0 left-0 pl-4 flex items-center transition-all duration-300"
                :class="[
                  isFocused.login || formData.login
                    ? 'text-cyan-600 dark:text-cyan-400'
                    : 'text-slate-400'
                ]"
              >
                <Icon :icon="loginIcon" class="w-5 h-5 transition-transform duration-300" 
                      :class="isFocused.login ? 'scale-110' : ''" />
              </div>

              <input
                :type="loginInputType"
                :inputmode="loginInputMode"
                class="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 bg-white/80 dark:bg-slate-800/80
                       focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-400
                       focus:ring-4 focus:ring-cyan-500/20 dark:focus:ring-cyan-400/20
                       transition-all duration-300 placeholder:text-slate-400
                       hover:border-cyan-300 dark:hover:border-cyan-600"
                :class="[
                  fieldErrors.login
                    ? 'border-red-300 dark:border-red-600 focus:border-red-500 focus:ring-red-500/20'
                    : 'border-slate-200 dark:border-slate-700'
                ]"
                v-model.trim="formData.login"
                placeholder="999123456 o email@ejemplo.com"
                :disabled="auth.loading"
                autocomplete="username"
                autocapitalize="off"
                autocorrect="off"
                spellcheck="false"
                :aria-invalid="!!fieldErrors.login"
                @focus="isFocused.login = true"
                @blur="isFocused.login = false"
                @input="clearFieldError('login')"
              />

              <!-- Indicador de validación -->
              <div v-if="formData.login && !fieldErrors.login" 
                   class="absolute inset-y-0 right-0 pr-4 flex items-center">
                <div class="w-6 h-6 rounded-full bg-cyan-100 dark:bg-cyan-900/50 grid place-items-center">
                  <Icon icon="mdi:check" class="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                </div>
              </div>
            </div>
            
            <!-- Error message con animación -->
            <transition name="error">
              <div v-if="fieldErrors.login" class="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
                <Icon icon="mdi:alert-circle" class="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0" />
                <p class="text-xs text-red-700 dark:text-red-300 font-medium">{{ fieldErrors.login }}</p>
              </div>
            </transition>
          </div>

          <!-- Password field -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Contraseña
            </label>
            <div class="relative group" :class="fieldErrors.password ? 'scale-[0.99]' : ''">
              <!-- Icono -->
              <div
                class="absolute inset-y-0 left-0 pl-4 flex items-center transition-all duration-300"
                :class="[
                  isFocused.password || formData.password
                    ? 'text-cyan-600 dark:text-cyan-400'
                    : 'text-slate-400'
                ]"
              >
                <Icon icon="mdi:lock-outline" class="w-5 h-5 transition-transform duration-300"
                      :class="isFocused.password ? 'scale-110' : ''" />
              </div>

              <input
                :type="passwordType"
                class="w-full pl-12 pr-12 py-3.5 rounded-2xl border-2 bg-white/80 dark:bg-slate-800/80
                       focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-400
                       focus:ring-4 focus:ring-cyan-500/20 dark:focus:ring-cyan-400/20
                       transition-all duration-300 placeholder:text-slate-400
                       hover:border-cyan-300 dark:hover:border-cyan-600"
                :class="[
                  fieldErrors.password
                    ? 'border-red-300 dark:border-red-600 focus:border-red-500 focus:ring-red-500/20'
                    : 'border-slate-200 dark:border-slate-700'
                ]"
                v-model="formData.password"
                placeholder="Ingresa tu contraseña"
                :disabled="auth.loading"
                autocomplete="current-password"
                :aria-invalid="!!fieldErrors.password"
                @focus="isFocused.password = true"
                @blur="isFocused.password = false"
                @input="clearFieldError('password')"
              />

              <!-- Toggle password con mejor diseño -->
              <button
                type="button"
                class="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 
                       hover:text-cyan-600 dark:hover:text-cyan-400 transition-all duration-300
                       hover:scale-110 active:scale-95"
                :aria-label="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
                @click="showPassword = !showPassword"
              >
                <Icon :icon="showPassword ? 'mdi:eye-off-outline' : 'mdi:eye-outline'" class="w-5 h-5" />
              </button>
            </div>

            <!-- Caps Lock y forgot password -->
            <div class="flex items-center justify-between gap-2 min-h-[24px]">
              <transition name="slide-fade">
                <div v-if="capsLockOn" class="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                  <Icon icon="mdi:keyboard" class="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span class="text-[11px] text-amber-700 dark:text-amber-300 font-medium">Bloq Mayús</span>
                </div>
              </transition>
              <a href="/auth/forgot" 
                 class="text-xs text-cyan-700 dark:text-cyan-400 hover:text-cyan-800 dark:hover:text-cyan-300 
                        font-medium hover:underline transition-colors ml-auto">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <!-- Error message -->
            <transition name="error">
              <div v-if="fieldErrors.password" class="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
                <Icon icon="mdi:alert-circle" class="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0" />
                <p class="text-xs text-red-700 dark:text-red-300 font-medium">{{ fieldErrors.password }}</p>
              </div>
            </transition>
          </div>

          <!-- Error del servidor -->
          <transition name="error">
            <div
              v-if="auth.error"
              class="p-4 bg-gradient-to-r from-red-50 to-red-100/50 dark:from-red-950/30 dark:to-red-900/20 
                     border-2 border-red-200 dark:border-red-800 rounded-2xl flex items-start gap-3
                     shadow-lg shadow-red-100 dark:shadow-red-950/50"
              role="alert"
            >
              <div class="w-8 h-8 rounded-xl bg-red-100 dark:bg-red-900/50 grid place-items-center flex-shrink-0">
                <Icon icon="mdi:alert-circle" class="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div class="flex-1 pt-0.5">
                <p class="text-sm text-red-800 dark:text-red-200 font-medium leading-relaxed">{{ auth.error }}</p>
              </div>
            </div>
          </transition>

          <!-- Botón mejorado con colores celestes -->
          <Button
            type="submit"
            fullWidth
            :loading="auth.loading"
            :disabled="auth.loading"
            class="!rounded-2xl !py-4 !font-semibold !text-base relative overflow-hidden group
                   bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-700 hover:to-sky-700
                   shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/40
                   transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
          >
            <!-- Efecto de brillo -->
            <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
            
            <span class="relative inline-flex items-center justify-center gap-2.5">
              <Icon icon="mdi:login-variant" class="w-5 h-5" />
              <span>Iniciar Sesión</span>
            </span>
          </Button>

          <!-- Footer con mejor diseño -->
          <div class="pt-2 space-y-3">
            <!-- Divider -->
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-slate-200 dark:border-slate-700"></div>
              </div>
              <div class="relative flex justify-center">
                <span class="px-3 bg-white/70 dark:bg-slate-900/60 text-xs text-slate-500 dark:text-slate-400">
                  Acceso seguro
                </span>
              </div>
            </div>

            <!-- Info -->
            <div class="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50">
              <Icon icon="mdi:shield-check" class="w-4 h-4 text-cyan-600 dark:text-cyan-400 flex-shrink-0" />
              <p class="text-xs text-slate-600 dark:text-slate-400 text-center leading-relaxed">
                Conexión cifrada y protegida
              </p>
            </div>
          </div>
        </form>
      </div>

      <!-- Footer info -->
      <div class="mt-6 text-center">
        <p class="text-xs text-slate-600 dark:text-slate-400">
          Universidad Nacional Agraria de la Selva
        </p>
        <p class="text-[10px] text-slate-500 dark:text-slate-500 mt-1">
          © 2025 SIMA-UNAS. Sistema de Monitoreo Agricola. Todos los derechos reservados.
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Animaciones personalizadas */
@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
}

@keyframes float-delayed {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-25px) rotate(-5deg); }
}

@keyframes float-slow {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(3deg); }
}

@keyframes pulse-slow {
  0%, 100% { opacity: 0.2; transform: scale(1); }
  50% { opacity: 0.3; transform: scale(1.05); }
}

@keyframes pulse-slower {
  0%, 100% { opacity: 0.2; transform: scale(1); }
  50% { opacity: 0.25; transform: scale(1.08); }
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float-delayed 7s ease-in-out infinite;
}

.animate-float-slow {
  animation: float-slow 8s ease-in-out infinite;
}

.animate-pulse-slow {
  animation: pulse-slow 8s ease-in-out infinite;
}

.animate-pulse-slower {
  animation: pulse-slower 10s ease-in-out infinite;
}

.animate-slide-up {
  animation: slide-up 0.6s ease-out;
}

/* Transiciones */
.error-enter-active, .error-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.error-enter-from {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

.error-leave-to {
  opacity: 0;
  transform: translateY(-5px) scale(0.98);
}

.slide-fade-enter-active, .slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(-10px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}
</style>