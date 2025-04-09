<script setup>
import MenuBar from '@/components/MenuBar.vue'
</script>

<template>
  <div class="flex flex-col flex-grow gap-4 p-[16px] bg-background items-center w-full h-full">
    <MenuBar />

    <main class="flex flex-col flex-grow gap-2 p-4 pt-8 items-center justify-left w-[60%] h-full">
      <h1 class="text-h1 text-text mb-8">À propos d'<span class="text-h1 text-esi-blue italic">Attendo</span></h1>
      <p class="text-text mb-6 "><span class="text-esi-blue italic">Attendo</span> est un outil de gestion de prise de présence conçu pour faciliter le suivi des étudiants 
        lors des sessions d'évaluation à l'ESI de la HE2B. Développé dans le cadre du cours 
        4WEB3 - Développement WEB 3 pour l'année scolaire 2024-2025, ce projet vise à simplifier la gestion des présences en 
        associant les étudiants à leurs unités d'enseignement (UE), sessions, épreuves et locaux.</p>

      <div class="w-full mb-8">
        <span class="text-h2 text-text">Auteur : </span>
        <span class="text-text">Alexis Ravasco (62664)</span>
      </div>

      <div class="w-full mb-8">
        <span class="text-h2 text-text">Technologies utilisées : </span>
        <span class="text-text">VueJS, Pinia, Vue-Router, TailwindCSS, Supabase (avec authentification Google OAuth)</span>
      </div>
    </main>
  </div>
</template>
