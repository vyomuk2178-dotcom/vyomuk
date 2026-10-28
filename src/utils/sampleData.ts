export interface SampleTopic {
  id: string;
  title: string;
  category: string;
  summary: string;
  content: string;
}

export const SAMPLE_TOPICS: SampleTopic[] = [
  {
    id: 'photosynthesis',
    title: 'Photosynthesis & Cellular Energy',
    category: 'Biology / Life Sciences',
    summary: 'The biochemical mechanism by which autotrophic plants synthesize glucose and release atmospheric oxygen.',
    content: `Photosynthesis is a physico-chemical process by which photosynthetic organisms (green plants, phytoplankton, cyanobacteria) capture electromagnetic solar radiation and convert it into stable chemical potential energy stored in covalent bonds of carbohydrate molecules.

The balanced chemical equation is:
6CO₂ + 6H₂O + Photons (λ ~ 400–700 nm) → C₆H₁₂O₆ + 6O₂

Cellular Location:
In eukaryotic plant cells, the process takes place in the chloroplast organelle. The internal membrane system comprises flattened discs called thylakoids stacked in columns known as grana, suspended within an aqueous enzymatic matrix termed the stroma.

The Two Biochemical Stages:
1. Light-Dependent Reactions (Thylakoid Membrane):
Chlorophyll a and b pigments absorb photon energy, elevating electrons to high-energy states within Photosystem II and Photosystem I. Photolysis splits water molecules into protons, electrons, and molecular oxygen (O₂). The flow of electrons through cytochrome complexes powers ATP synthase to generate ATP and NADPH via photophosphorylation.

2. The Calvin Cycle (Light-Independent Reactions, Stroma):
The enzyme RuBisCO (Ribulose-1,5-bisphosphate carboxylase-oxygenase) catalyzes the fixation of carbon dioxide. Using the chemical energy of ATP and the reducing equivalents of NADPH generated during the light phase, glyceraldehyde-3-phosphate (G3P) is synthesized, which subsequently combines into glucose, sucrose, and cellulose.`
  },
  {
    id: 'newtons_laws',
    title: "Newton's Laws of Motion & Classical Mechanics",
    category: 'Physics / Mechanics',
    summary: 'The fundamental physical laws describing the relationship between mass, applied forces, and acceleration.',
    content: `Sir Isaac Newton formulated the foundation of classical mechanics in his 1687 treatise Philosophiae Naturalis Principia Mathematica.

First Law (The Law of Inertia):
An object at rest remains at rest, and an object in uniform motion continues moving at constant velocity along a straight path unless acted upon by a non-zero resultant net external force:
ΣF = 0 ⇒ dv/dt = 0

Second Law (Fundamental Equation of Dynamics):
The vector rate of change of linear momentum of a body is directly proportional to the applied force and occurs in the direction of that force. For constant inertial mass m:
F_net = m · a
where F is force in Newtons (N = kg·m/s²), m is scalar inertial mass in kilograms, and a is acceleration in meters per second squared (m/s²).

Third Law (Law of Action-Reaction):
Whenever body A exerts a force on body B, body B simultaneously exerts an equal in magnitude and oppositely directed force on body A:
F_AB = -F_BA

Conservation Implications:
These three principles lead directly to the conservation of linear momentum in closed isolated physical systems, foundational for rocket propulsion, orbital mechanics, and automotive safety design.`
  },
  {
    id: 'plate_tectonics',
    title: 'Plate Tectonics & Continental Drift',
    category: 'Earth Sciences / Geology',
    summary: 'How Earth lithospheric plates interact across divergent, convergent, and transform boundaries.',
    content: `The theory of Plate Tectonics unified Alfred Wegener's early 1912 hypothesis of continental drift with mid-20th century seafloor bathymetry and paleomagnetic discoveries.

Geophysical Structure:
The outermost mechanical layer of Earth is the rigid, brittle lithosphere (averaging 100 km in thickness, comprising continental and oceanic crust and the uppermost solid mantle). The lithosphere floats atop the hotter, ductile, and plastically deforming asthenosphere.

Mantle Convection & Driving Forces:
Internal thermal decay from radioactive isotopes (uranium, thorium, potassium-40) creates convective currents in the mantle. Key driving forces include 'slab pull' (cold, dense oceanic lithosphere sinking into subduction zones) and 'ridge push' (gravitational sliding away from elevated mid-ocean ridges).

Plate Boundary Classifications:
1. Divergent Boundaries: Plates move apart (e.g., Mid-Atlantic Ridge, East African Rift). Magma ascends to create new oceanic basalt crust.
2. Convergent Boundaries: Plates collide. Subduction occurs when dense oceanic crust sinks beneath continental or younger oceanic crust, generating deep trenches and volcanic island arcs. Continental-continental collision forms mountain orogenies (e.g., Himalayas).
3. Transform Boundaries: Plates slide horizontally past one another (e.g., San Andreas Fault), releasing accumulated strain energy via periodic seismic earthquakes.`
  },
  {
    id: 'machine_learning',
    title: 'Introduction to Artificial Neural Networks',
    category: 'Computer Science / AI',
    summary: 'Mathematical principles of artificial neurons, forward propagation, loss calculation, and backpropagation.',
    content: `Artificial Neural Networks (ANNs) are computational graphs inspired by biological brain neuroanatomy.

The Artificial Perceptron:
Each neuron calculates an affine transformation followed by a non-linear activation function:
z = Σ(w_i · x_i) + b
y = σ(z)
where x_i denotes input features, w_i denotes learned synaptic weights, b represents the bias scalar, and σ denotes the activation function (such as ReLU, Sigmoid, or GELU) that enables the network to approximate non-linear functions.

Network Architecture:
1. Input Layer: Ingests raw multidimensional feature vectors.
2. Hidden Layers: Extract hierarchical latent feature representations through matrix multiplications.
3. Output Layer: Generates predictions (e.g., probability distribution via Softmax for classification, or continuous real values for regression).

Training via Gradient Descent & Backpropagation:
To train the parameters (weights and biases), an objective loss function L(y_true, y_pred) quantifies prediction error. The chain rule of calculus computes the partial derivatives of loss with respect to every parameter:
∂L/∂w = (∂L/∂y) · (∂y/∂z) · (∂z/∂w)
Weights are iteratively updated via Stochastic Gradient Descent:
w_new = w_old - η · ∇_w(L)
where η represents the learning rate hyperparameter.`
  }
];

export const SAMPLE_SIMPLIFICATION = {
  title: "Photosynthesis: How Plants Make Food from Sunlight",
  level: "school" as const,
  summary: "Photosynthesis is the natural process where plants take two basic ingredients—water and carbon dioxide—and transform them into sugar (glucose) and clean oxygen powered by sunlight.",
  plainExplanation: "Think of a plant leaf as a miniature solar-powered kitchen. Chlorophyll inside the leaf acts like solar panels catching light energy. The roots act as water pipes absorbing moisture from soil, and tiny pores under the leaf (stomata) breathe in carbon dioxide gas. Inside the plant cell's chloroplast factories, these ingredients are combined to make glucose (energy sugar) and release clean oxygen into our air.",
  importantConcepts: [
    {
      term: "Chlorophyll",
      explanation: "A green pigment inside plant cells that traps sunlight energy, giving plants their vibrant green color."
    },
    {
      term: "Chloroplast",
      explanation: "The specialized cellular factory inside leaf cells where photosynthesis chemical reactions occur."
    },
    {
      term: "Glucose",
      explanation: "A simple sugar molecule (C₆H₁₂O₆) created by the plant to store chemical energy for growth and repair."
    }
  ],
  difficultTerms: [
    {
      term: "Stomata",
      definition: "Microscopic openings on the surface of plant leaves.",
      everydayComparison: "Like tiny nostrils on the leaf that open to breathe in CO₂ and close to prevent water loss."
    },
    {
      term: "Photolysis",
      definition: "The chemical decomposition of water molecules induced by light.",
      everydayComparison: "Like a light scissor that cuts water into hydrogen building blocks and oxygen waste."
    }
  ],
  analogies: [
    {
      concept: "Solar Cooking",
      analogy: "Photosynthesis is just like baking bread in a solar-powered oven: light is the heat source, water and carbon dioxide are the flour and yeast, and glucose is the fresh bread."
    }
  ],
  keyTakeaways: [
    "Photosynthesis requires three key inputs: Sunlight, Water (H₂O), and Carbon Dioxide (CO₂).",
    "It produces two primary outputs: Glucose (plant food) and Oxygen (O₂).",
    "It forms the biological foundation of virtually all oxygen-based life and food chains on Earth."
  ],
  quickRecap: "Plants drink water, breathe carbon dioxide, absorb sunlight, and produce sweet glucose and fresh oxygen.",
  followUpQuestions: [
    "What would happen to photosynthesis during prolonged drought or dark conditions?",
    "How does cellular respiration in animals connect to photosynthesis in plants?",
    "Why are deep-ocean plants often brown or red instead of bright green?"
  ],
  isDemo: false
};

export const SAMPLE_NOTES = {
  title: "Comprehensive Study Notes: Cellular Energy & Photosynthesis",
  length: "standard" as const,
  overview: "An organized breakdown of photosynthetic pathways, biochemical inputs, stages of light-dependent and light-independent reactions, and global ecological significance.",
  sections: [
    {
      heading: "1. Core Equation & Biochemical Inputs",
      content: "The balanced chemical formula representing oxygenic photosynthesis is 6CO₂ + 6H₂O + Light Energy → C₆H₁₂O₆ + 6O₂.",
      subpoints: [
        "Reactants: 6 molecules of Carbon Dioxide and 6 molecules of Water.",
        "Catalyst: Chlorophyll pigments absorbing violet-blue and red light wavelengths.",
        "Products: 1 molecule of Glucose and 6 molecules of atmospheric Oxygen gas."
      ]
    },
    {
      heading: "2. The Two Stages of Photosynthesis",
      content: "Photosynthesis occurs in two interdependent continuous phases within chloroplast structures.",
      subpoints: [
        "Light-Dependent Reactions: Occur in the thylakoid membranes; water is split, releasing O₂ and producing ATP + NADPH.",
        "Calvin Cycle (Light-Independent): Occurs in the stroma; CO₂ is fixed into carbohydrate chains using ATP and NADPH energy."
      ]
    }
  ],
  definitions: [
    { term: "Thylakoid", definition: "Flattened sac-like membrane structures inside chloroplasts where light-dependent reactions take place." },
    { term: "Stroma", definition: "The fluid-filled internal space surrounding grana thylakoids where carbon fixation enzymes operate." },
    { term: "ATP (Adenosine Triphosphate)", definition: "The universal molecular currency of biochemical cellular energy." }
  ],
  formulas: [
    {
      name: "Photosynthesis General Equation",
      formula: "6CO₂ + 6H₂O + Photons → C₆H₁₂O₆ + 6O₂",
      explanation: "Converts low-energy inorganic molecules into high-energy organic carbohydrates."
    }
  ],
  revisionChecklist: [
    "Memorize the balanced chemical equation for photosynthesis.",
    "Identify chloroplast anatomy (thylakoid, granum, stroma, double membrane).",
    "Compare the light-dependent phase with the Calvin cycle.",
    "Explain how environmental factors (light intensity, CO₂ level, temperature) affect reaction velocity."
  ],
  finalSummary: "Photosynthesis bridges cosmic solar energy to terrestrial living ecosystems, generating the food reserves and atmospheric oxygen required for modern biosphere existence.",
  sourceCitationNote: "Content structured from standard biological educational principles; verify specific textbook chapter page numbers.",
  isDemo: false
};

export const SAMPLE_ACTIVITIES = {
  title: "Photosynthesis Quiz & Flashcards",
  flashcards: [
    {
      id: "fc-1",
      question: "What are the three essential raw inputs for photosynthesis?",
      answer: "Sunlight, Water (H₂O), and Carbon Dioxide (CO₂).",
      hint: "Light from above, moisture from below, and gas from the atmosphere.",
      category: "Fundamentals"
    },
    {
      id: "fc-2",
      question: "Where in the plant cell do light reactions take place?",
      answer: "Across the thylakoid membranes within chloroplasts.",
      hint: "Look for the disc-shaped membrane stacks.",
      category: "Cell Anatomy"
    },
    {
      id: "fc-3",
      question: "What gas is released as a byproduct when water is split during photolysis?",
      answer: "Oxygen gas (O₂).",
      hint: "The vital gas humans and animals breathe in.",
      category: "Reactions"
    },
    {
      id: "fc-4",
      question: "What is the primary organic molecule synthesized by plants to store energy?",
      answer: "Glucose (C₆H₁₂O₆).",
      hint: "A six-carbon hexose sugar.",
      category: "Biochemistry"
    }
  ],
  quiz: [
    {
      id: "q-1",
      question: "Which cellular organelle is responsible for conducting photosynthesis in plant cells?",
      options: ["Mitochondria", "Chloroplast", "Golgi Apparatus", "Endoplasmic Reticulum"],
      correctIndex: 1,
      explanation: "Chloroplasts contain the chlorophyll pigments and biochemical machinery required to harvest photon energy and fix carbon.",
      difficulty: "easy" as const
    },
    {
      id: "q-2",
      question: "During which phase of photosynthesis is carbon dioxide converted into carbohydrate sugars?",
      options: ["Light-dependent photolysis", "The Calvin Cycle (Light-independent reactions)", "Glycolysis", "The Krebs cycle"],
      correctIndex: 1,
      explanation: "The Calvin Cycle occurs in the stroma of the chloroplast and uses chemical energy (ATP and NADPH) from light reactions to fix CO₂ into glucose precursors.",
      difficulty: "medium" as const
    },
    {
      id: "q-3",
      question: "Why do most plant leaves appear green to human eyes?",
      options: [
        "Chlorophyll absorbs green light and reflects red and blue light.",
        "Chlorophyll reflects green light wavelengths while absorbing blue and red wavelengths.",
        "Plant cell walls are naturally dyed green by nitrogen atoms.",
        "Stomata refract sunlight into only green spectrum bands."
      ],
      correctIndex: 1,
      explanation: "Chlorophyll pigments absorb photons from the blue and red spectra most efficiently, while reflecting green light back to our retinas.",
      difficulty: "medium" as const
    }
  ],
  isDemo: false
};

export const SAMPLE_TRANSLATION = {
  originalText: "Photosynthesis is the physico-chemical process by which photosynthetic organisms capture solar radiation and convert it into chemical potential energy.",
  translatedText: "प्रकाश संश्लेषण वह भौतिक-रासायनिक प्रक्रिया है जिसके द्वारा प्रकाश संश्लेषक जीव सौर विकिरण को ग्रहण करते हैं और इसे रासायनिक संभावित ऊर्जा में परिवर्तित करते हैं।",
  detectedSourceLanguage: "English",
  targetLanguage: "Hindi",
  keyTerminologyMap: [
    { source: "Photosynthesis", translated: "प्रकाश संश्लेषण (Prakash Sanshleshan)", definition: "सौर ऊर्जा को रासायनिक ऊर्जा में बदलना" },
    { source: "Solar Radiation", translated: "सौर विकिरण (Saur Vikiran)", definition: "सूर्य से आने वाली प्रकाश तरंगें" },
    { source: "Chemical Potential Energy", translated: "रासायनिक संभावित ऊर्जा", definition: "अणुओं में संग्रहीत ऊर्जा" }
  ],
  academicNote: "शैक्षणिक अध्ययन हेतु मानकीकृत शब्दावली में अनुवादित।",
  isDemo: false
};
