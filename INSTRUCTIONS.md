# Pub Manager v1.0 – Development Instructions

## 🎯 Obiettivo del progetto
Creare un gestionale professionale per Pub/Bar che includa:
- Gestione tavoli
- Gestione ordini (POS Interface)
- Kitchen Display System (KDS)
- Gestione prodotti e varianti
- Magazzino e ingredienti (Inventory Management)
- Ricette (Recipe Management)
- Gestione fornitori e acquisti (Supplier Management)
- Analisi finanziaria e report (Financial Tracking)
- Gestione allergeni
- Configurazioni e impostazioni del sistema
- Mobile optimization e dashboard responsive

---

## 🏗️ Architettura
- **Backend:** Node.js + Express, struttura modulare (controllers / services / models / routes)
- **Frontend:** React + Vite, Context API per state management globale
- **Database:** MySQL, organizzazione chiara delle tabelle e relazioni
- **Autenticazione:** Passport.js con JWT/sessioni e gestione ruoli (admin, manager, waiter, chef)
- **Routing:** RESTful completo con protezione delle route (Protected/Public)
- **Realtime:** WebSocket per KDS e aggiornamenti ordini

---


---

## 📦 Linee guida per sviluppo
1. Seguire la separazione chiara tra **logica di business** e **presentazione**.  
2. Usare **async/await** con gestione errori centralizzata (middleware).  
3. Tutti i moduli devono avere:  
   - Model (Prisma o ORM equivalente)  
   - Controller  
   - Service  
   - Route  
   - Validazioni (Zod/Joi)  
4. Struttura frontend modulare con componenti riutilizzabili.  
5. UI mobile-first e responsive, con attenzione a accessibilità.  
6. Non committare mai file `.env` o segreti: usare `.env.example`.  
7. Gestire logging e error monitoring (Sentry) quando possibile.  

---

## 🔐 Sicurezza e production readiness
- Rate limiting per endpoint critici  
- Input validation e sanitization  
- Configurazione CORS per produzione  
- Hardening session e cookie  
- Backup e recovery database  
- Logging centralizzato  

---

## 🚀 Roadmap iniziale (Fase MVP)
1. **POS Interface completo**  
   - Touch-friendly order interface  
   - Table selection e management  
   - Quick product selection  
   - Bill calculation e split  
   - Cash register integration  

2. **Kitchen Display System (KDS)**  
   - Real-time order visualization  
   - Order status tracking  
   - Preparation time estimates  
   - Kitchen workflow optimization  

3. **Basic Payment Processing**  
   - Cash handling  
   - Card payment integration (Stripe/Square)  
   - Receipt generation e printing  
   - Daily closing procedures  

4. **Security Hardening**  
   - Input validation completa  
   - Rate limiting  
   - Session security  
   - Environment configuration  

---

## ⚡ Fasi successive (Post-MVP)
- Advanced reporting e dashboard analytics  
- Multi-user real-time con WebSocket  
- Mobile optimization per camerieri e manager  
- Integrazione con sistemi contabili e API fornitori  
- Multi-location support e gestione franchise  
- Automazioni avanzate, AI prediction, staff scheduling  

---

## 📁 Struttura consigliata

/backend
  /src
    /modules
      /auth
      /users
      /tables
      /orders
      /products
      /inventory
      /recipes
      /suppliers
      /financials
    /config
    /middlewares
    /utils
    app.ts
  package.json

/frontend
  /src
    /components
    /pages
    /contexts
    /services
    /styles
  index.html
  package.json

/docker-compose.yml
/Dockerfile
/INSTRUCTIONS.md
/README.md

---

## 🤖 Copilot / Guideline per chi sviluppa
- Scrivere codice chiaro, modulare e commentato  
- Usare TypeScript dove possibile  
- Seguire le strutture delle cartelle senza modificare l’architettura base  
- Generare codice solo su richiesta  
- Proporre ottimizzazioni dopo che la struttura base funziona  

---

## 📝 Note finali
- Ogni nuovo modulo deve seguire la convenzione **Model → Service → Controller → Route**  
- Tutti i moduli devono avere test unitari e di integrazione  
- Aggiornare sempre README e INSTRUCTIONS se aggiungi nuove funzionalità  

