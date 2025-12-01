<template>
  <div class="events-wrapper">
    <p v-if="loading" class="info-text">Chargement des événements...</p>
    <p v-else-if="errorMessage" class="info-text error">{{ errorMessage }}</p>
    <p v-else-if="!currentUser" class="info-text">
      Connecte-toi pour voir et voter sur les événements.
    </p>
    <p v-else-if="events.length === 0" class="info-text">
      Aucun événement trouvé.
    </p>

    <div
      v-else
      v-for="event in events"
      :key="event.id"
      class="event-card"
    >
      <div class="event-header">
        <h3 class="event-title">{{ event.title }}</h3>
        <p class="event-date">{{ formatDate(event.date) }}</p>
      </div>

      <div v-if="event.img" class="event-image-wrapper">
        <img :src="event.img" alt="Image de l'événement" class="event-image" />
      </div>

      <p class="event-description">{{ event.description }}</p>

      <div class="event-stats">
        <span class="badge yes">Yes: {{ event.yesVotes || 0 }}</span>
        <span class="badge no">No: {{ event.noVotes || 0 }}</span>
      </div>

      <div class="vote-actions">
        <button
          @click="vote(event.id, 'yes')"
          :disabled="isVoting || userVotes[event.id]"
        >
          Yes
        </button>
        <button
          @click="vote(event.id, 'no')"
          :disabled="isVoting || userVotes[event.id]"
        >
          No
        </button>
        <span v-if="userVotes[event.id]">
          (Tu as voté: {{ userVotes[event.id] === 'yes' ? 'Yes' : 'No' }})
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {
  collection,
  getDocs,
  doc,
  runTransaction,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/Firebase/Config';

const events = ref([]);
const loading = ref(true);
const errorMessage = ref('');
const isVoting = ref(false);
const currentUser = ref(null);
const userVotes = ref({}); // { [eventId]: 'yes' | 'no' }

const formatDate = (value) => {
  if (!value) return '';

  // Firestore Timestamp -> convertir en date lisible
  if (typeof value === 'object' && 'seconds' in value) {
    const d = new Date(value.seconds * 1000);
    return d.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  // Si c'est déjà une chaîne (ex: "9 décembre 2025")
  return value;
};

const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  currentUser.value = user;
});

const fetchEvents = async () => {
  loading.value = true;
  errorMessage.value = '';

  try {
    // Utilise la même collection pour lecture et écriture ("Events")
    const querySnapshot = await getDocs(collection(db, 'Events'));
    events.value = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Erreur lors de la récupération des événements:', error);
    errorMessage.value = error.message || 'Erreur lors de la récupération des événements.';
  } finally {
    loading.value = false;
  }
};

const vote = async (eventId, choice) => {
  if (!currentUser.value) {
    errorMessage.value = 'Vous devez être connecté pour voter.';
    return;
  }

  if (userVotes.value[eventId]) {
    errorMessage.value = 'Vous avez déjà voté pour cet événement.';
    return;
  }

  isVoting.value = true;
  errorMessage.value = '';

  try {
    // Référence vers l'événement dans la collection "Events"
    const eventRef = doc(db, 'Events', eventId);
    const voteRef = doc(
      collection(db, 'Events', eventId, 'votes'),
      currentUser.value.uid,
    );

    await runTransaction(db, async (transaction) => {
      const existingVoteSnap = await transaction.get(voteRef);
      if (existingVoteSnap.exists()) {
        throw new Error('Vous avez déjà voté pour cet événement.');
      }

      const eventSnap = await transaction.get(eventRef);
      if (!eventSnap.exists()) {
        throw new Error("L'événement n'existe plus.");
      }

      const data = eventSnap.data();
      const currentYes = data.yesVotes || 0;
      const currentNo = data.noVotes || 0;

      transaction.update(eventRef, {
        yesVotes: choice === 'yes' ? currentYes + 1 : currentYes,
        noVotes: choice === 'no' ? currentNo + 1 : currentNo,
        updatedAt: serverTimestamp(),
      });

      transaction.set(voteRef, {
        userId: currentUser.value.uid,
        choice,
        createdAt: serverTimestamp(),
      });
    });

    // Mise à jour locale de l'état
    userVotes.value = {
      ...userVotes.value,
      [eventId]: choice,
    };

    await fetchEvents();
  } catch (error) {
    console.error('Erreur lors du vote:', error);
    errorMessage.value =
      error.message || 'Erreur lors du vote. Veuillez réessayer.';
  } finally {
    isVoting.value = false;
  }
};

onMounted(fetchEvents);
</script>

<style>
.events-wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-text {
  font-size: 0.9rem;
  color: #666;
  text-align: left;
  margin-bottom: 8px;
}

.info-text.error {
  color: #e74c3c;
}

.event-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 16px 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.06);
  text-align: left;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.event-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.08);
}

.event-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 6px;
}

.event-title {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
  color: #2c3e50;
}

.event-date {
  margin: 0;
  font-size: 0.85rem;
  color: #888;
}

.event-description {
  margin: 4px 0 10px;
  font-size: 0.9rem;
  color: #555;
}

.event-image-wrapper {
  margin: 6px 0 10px;
}

.event-image {
  width: 100%;
  max-height: 220px;
  object-fit: cover;
  border-radius: 10px;
  display: block;
}

.event-stats {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
}

.badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
  color: #fff;
}

.badge.yes {
  background: #27ae60;
}

.badge.no {
  background: #e74c3c;
}

.vote-actions {
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.vote-actions button {
  padding: 6px 14px;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  color: #fff;
  transition: background 0.15s ease, transform 0.1s ease, box-shadow 0.1s ease;
}

.vote-actions button:first-of-type {
  background: #27ae60;
}

.vote-actions button:last-of-type {
  background: #e67e22;
}

.vote-actions button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}

.vote-actions button:not(:disabled):hover {
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.18);
  transform: translateY(-1px);
}

.vote-actions span {
  font-size: 0.8rem;
  color: #555;
}
</style>
