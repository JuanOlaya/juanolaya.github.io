const fs = require('fs');
const path = require('path');

const newExamples = {
  "sein": {
    "Sie (formal)": {
      "de": "Herr Müller, sind Sie der Lehrer?",
      "en": "Mr. Müller, are you the teacher?",
      "es": "Sr. Müller, ¿es usted el profesor?"
    }
  },
  "haben": {
    "Sie (formal)": {
      "de": "Haben Sie Zeit, Frau Schmidt?",
      "en": "Do you have time, Mrs. Schmidt?",
      "es": "¿Tiene usted tiempo, Sra. Schmidt?"
    }
  },
  "werden": {
    "Sie (formal)": {
      "de": "Werden Sie gesund, Herr Doktor!",
      "en": "Get well, Doctor!",
      "es": "¡Que se mejore, doctor!"
    }
  },
  "machen": {
    "Sie (formal)": {
      "de": "Was machen Sie beruflich?",
      "en": "What do you do for a living?",
      "es": "¿A qué se dedica usted?"
    }
  },
  "geben": {
    "Sie (formal)": {
      "de": "Geben Sie mir bitte die Speisekarte.",
      "en": "Please give me the menu.",
      "es": "Por favor, déme el menú."
    }
  },
  "sagen": {
    "Sie (formal)": {
      "de": "Was sagen Sie dazu, Herr Professor?",
      "en": "What do you say about that, Professor?",
      "es": "¿Qué opina usted, profesor?"
    }
  },
  "gehen": {
    "Sie (formal)": {
      "de": "Gehen Sie zum Arzt?",
      "en": "Are you going to the doctor?",
      "es": "¿Va usted al médico?"
    }
  },
  "kommen": {
    "Sie (formal)": {
      "de": "Kommen Sie aus Deutschland, Frau Meyer?",
      "en": "Are you from Germany, Mrs. Meyer?",
      "es": "¿Viene usted de Alemania, Sra. Meyer?"
    }
  },
  "sehen": {
    "Sie (formal)": {
      "de": "Sehen Sie das Problem?",
      "en": "Do you see the problem?",
      "es": "¿Ve usted el problema?"
    }
  },
  "sprechen": {
    "Sie (formal)": {
      "de": "Sprechen Sie Deutsch, Herr Johnson?",
      "en": "Do you speak German, Mr. Johnson?",
      "es": "¿Habla usted alemán, Sr. Johnson?"
    }
  },
  "kaufen": {
    "Sie (formal)": {
      "de": "Was kaufen Sie heute?",
      "en": "What are you buying today?",
      "es": "¿Qué compra usted hoy?"
    }
  },
  "essen": {
    "Sie (formal)": {
      "de": "Was essen Sie gern?",
      "en": "What do you like to eat?",
      "es": "¿Qué le gusta comer?"
    }
  },
  "trinken": {
    "Sie (formal)": {
      "de": "Was trinken Sie, bitte?",
      "en": "What would you like to drink, please?",
      "es": "¿Qué desea tomar, por favor?"
    }
  },
  "lesen": {
    "Sie (formal)": {
      "de": "Lesen Sie die Zeitung?",
      "en": "Do you read the newspaper?",
      "es": "¿Lee usted el periódico?"
    }
  },
  "schreiben": {
    "Sie (formal)": {
      "de": "Schreiben Sie die Adresse, bitte.",
      "en": "Please write the address.",
      "es": "Por favor, escriba la dirección."
    }
  },
  "hören": {
    "Sie (formal)": {
      "de": "Hören Sie das auch?",
      "en": "Do you hear that too?",
      "es": "¿Oye usted eso también?"
    }
  },
  "fragen": {
    "Sie (formal)": {
      "de": "Fragen Sie den Chef.",
      "en": "Ask the boss.",
      "es": "Pregunte al jefe."
    }
  },
  "bezahlen": {
    "Sie (formal)": {
      "de": "Wie bezahlen Sie, mit Karte?",
      "en": "How would you like to pay, by card?",
      "es": "¿Cómo paga usted, con tarjeta?"
    }
  },
  "arbeiten": {
    "Sie (formal)": {
      "de": "Wo arbeiten Sie, Herr Klein?",
      "en": "Where do you work, Mr. Klein?",
      "es": "¿Dónde trabaja usted, Sr. Klein?"
    }
  },
  "lernen": {
    "Sie (formal)": {
      "de": "Lernen Sie Deutsch?",
      "en": "Are you learning German?",
      "es": "¿Aprende usted alemán?"
    }
  },
  "wohnen": {
    "Sie (formal)": {
      "de": "Wo wohnen Sie, Frau Fischer?",
      "en": "Where do you live, Mrs. Fischer?",
      "es": "¿Dónde vive usted, Sra. Fischer?"
    }
  },
  "leben": {
    "Sie (formal)": {
      "de": "Leben Sie allein?",
      "en": "Do you live alone?",
      "es": "¿Vive usted solo?"
    }
  },
  "schlafen": {
    "Sie (formal)": {
      "de": "Schlafen Sie gut, Frau Weber?",
      "en": "Do you sleep well, Mrs. Weber?",
      "es": "¿Duerme usted bien, Sra. Weber?"
    }
  },
  "fahren": {
    "Sie (formal)": {
      "de": "Fahren Sie mit dem Taxi?",
      "en": "Are you taking a taxi?",
      "es": "¿Va usted en taxi?"
    }
  },
  "fliegen": {
    "Sie (formal)": {
      "de": "Fliegen Sie nach Berlin?",
      "en": "Are you flying to Berlin?",
      "es": "¿Vuela usted a Berlín?"
    }
  },
  "heißen": {
    "Sie (formal)": {
      "de": "Wie heißen Sie, bitte?",
      "en": "What is your name, please?",
      "es": "¿Cómo se llama usted, por favor?"
    }
  },
  "rauchen": {
    "Sie (formal)": {
      "de": "Rauchen Sie, Herr Wagner?",
      "en": "Do you smoke, Mr. Wagner?",
      "es": "¿Fuma usted, Sr. Wagner?"
    }
  },
  "wissen": {
    "Sie (formal)": {
      "de": "Wissen Sie die Antwort?",
      "en": "Do you know the answer?",
      "es": "¿Sabe usted la respuesta?"
    }
  },
  "kennen": {
    "Sie (formal)": {
      "de": "Kennen Sie Frau Müller?",
      "en": "Do you know Mrs. Müller?",
      "es": "¿Conoce usted a la Sra. Müller?"
    }
  },
  "denken": {
    "Sie (formal)": {
      "de": "Was denken Sie, Herr Direktor?",
      "en": "What do you think, Director?",
      "es": "¿Qué piensa usted, director?"
    }
  },
  "glauben": {
    "Sie (formal)": {
      "de": "Glauben Sie mir?",
      "en": "Do you believe me?",
      "es": "¿Me cree usted?"
    }
  },
  "finden": {
    "Sie (formal)": {
      "de": "Wie finden Sie das Hotel?",
      "en": "How do you like the hotel?",
      "es": "¿Qué le parece el hotel?"
    }
  },
  "suchen": {
    "Sie (formal)": {
      "de": "Was suchen Sie?",
      "en": "What are you looking for?",
      "es": "¿Qué busca usted?"
    }
  },
  "bringen": {
    "Sie (formal)": {
      "de": "Bringen Sie bitte die Rechnung.",
      "en": "Please bring the bill.",
      "es": "Por favor, traiga la cuenta."
    }
  },
  "kosten": {
    "Sie (formal)": {
      "de": "Was kosten die Tickets?",
      "en": "What do the tickets cost?",
      "es": "¿Cuánto cuestan las entradas?"
    }
  },
  "brauchen": {
    "Sie (formal)": {
      "de": "Was brauchen Sie?",
      "en": "What do you need?",
      "es": "¿Qué necesita usted?"
    }
  },
  "dürfen": {
    "Sie (formal)": {
      "de": "Dürfen Sie hier parken?",
      "en": "Are you allowed to park here?",
      "es": "¿Puede usted aparcar aquí?"
    }
  },
  "müssen": {
    "Sie (formal)": {
      "de": "Müssen Sie heute arbeiten?",
      "en": "Do you have to work today?",
      "es": "¿Tiene usted que trabajar hoy?"
    }
  },
  "wollen": {
    "Sie (formal)": {
      "de": "Was wollen Sie trinken?",
      "en": "What would you like to drink?",
      "es": "¿Qué desea tomar?"
    }
  },
  "sollen": {
    "Sie (formal)": {
      "de": "Sollen Sie zum Chef gehen?",
      "en": "Are you supposed to go to the boss?",
      "es": "¿Debe usted ir al jefe?"
    }
  },
  "mögen": {
    "Sie (formal)": {
      "de": "Mögen Sie Kaffee?",
      "en": "Do you like coffee?",
      "es": "¿Le gusta el café?"
    }
  },
  "können": {
    "Sie (formal)": {
      "de": "Können Sie mir helfen?",
      "en": "Can you help me?",
      "es": "¿Puede usted ayudarme?"
    }
  },
  "möchten": {
    "Sie (formal)": {
      "de": "Was möchten Sie bestellen?",
      "en": "What would you like to order?",
      "es": "¿Qué desea pedir?"
    }
  }
};

// Update each verb file
Object.keys(newExamples).forEach(verb => {
  const filePath = path.join('json', 'praesens', `${verb}.json`);

  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    // Check if praesens_examples exists
    if (data.praesens_examples) {
      // Update the Sie (formal) example
      if (data.praesens_examples['Sie (formal)']) {
        data.praesens_examples['Sie (formal)'] = newExamples[verb]['Sie (formal)'];
        console.log(`✓ Updated ${verb}`);
      } else {
        console.log(`⚠ ${verb}: No Sie (formal) entry found`);
      }
    } else {
      // Create praesens_examples if it doesn't exist
      data.praesens_examples = {};

      // Copy all pronoun examples from praesens conjugations
      const pronouns = ['ich', 'du', 'er', 'sie', 'es', 'wir', 'ihr', 'sie (plural)', 'Sie (formal)'];
      pronouns.forEach(pronoun => {
        if (pronoun === 'Sie (formal)') {
          data.praesens_examples[pronoun] = newExamples[verb]['Sie (formal)'];
        } else {
          // Create placeholder examples for other pronouns
          data.praesens_examples[pronoun] = {
            "de": "",
            "en": "",
            "es": ""
          };
        }
      });

      console.log(`✓ Created praesens_examples for ${verb}`);
    }

    // Write back to file
    fs.writeFileSync(filePath, JSON.stringify(data, null, 4), 'utf8');
  } else {
    console.log(`✗ File not found: ${verb}`);
  }
});

console.log('\n✅ All A1.1 verbs updated successfully!');
