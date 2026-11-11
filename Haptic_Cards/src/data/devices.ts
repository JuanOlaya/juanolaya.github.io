import type { Device } from './types';

/**
 * The 92 peer-reviewed controllers, in their original order. `category` is the mechanism pattern and
 * `audit` the coded sensations behind the versatility rating. Media rules: see ../../README.md.
 */
export const devices: readonly Device[] = [
  {
    name: 'LeverForce',
    category: 'Solid mass shifting',
    author: 'Juan Olaya et al.',
    title: 'LeverForce: Rendering Versatile Haptic Feedback for VR Controllers using Weight Shifting',
    mechanism: 'Motorized lever arm shifts moving mass along lever to modulate CoM, inertia, and force cues.',
    useCaseText:
      'Simulating heavy tool dynamics, automotive gear resistance, aviation joystick torque, recoil impacts, and versatile physical interactions in virtual reality.',
    useCaseTags: [
      'Resistance cues',
      'Impact cues',
      'Motion cues',
      'Weight magnitude cues',
      'Weight distribution cues',
    ],
    generalUseCases: ['Gaming', 'Training', 'Aviation Simulator', 'Automotive Simulator'],
    submodalities: ['Resistance', 'Impact', 'Motion', 'Weight magnitude', 'Weight distribution'],
    media: [
      {
        type: 'image',
        src: 'img/leverforce.png',
      },
      {
        type: 'image',
        src: 'img/leverforce_teaser.png',
      },
      {
        type: 'image',
        src: 'img/leverforce_car.png',
      },
      {
        type: 'image',
        src: 'img/leverforce_helicopter.jpg',
      },
    ],
    doi: '10.1145/3861188.3861231',
    publication: 'ACM MUM',
    year: '2026',
    audit: {
      score: 5,
      ticks_str: '5',
      sensations: ['Resistance', 'Impact', 'Motion', 'Weight magnitude', 'Weight distribution'],
      status: 'exemplar',
    },
  },
  {
    name: 'Drag:on',
    category: 'Aerodynamic resistance',
    author: 'André Zenner, Antonio Krüger',
    title:
      'Drag:on: A Virtual Reality Controller Providing Dynamic Drag and Weight Feedback Based on Flow and Mass Manipulation',
    mechanism: 'A folding fan opens and closes to vary air drag and weight shift as the controller is swung.',
    useCaseText:
      'Providing dynamic drag, variable weight shift, and virtual shape feedback during swinging and virtual interactions.',
    useCaseTags: ['Resistance cues', 'Weight magnitude cues', 'Shape cues'],
    generalUseCases: ['Gaming', 'Training', 'Object simulation'],
    submodalities: ['Resistance', 'Weight magnitude', 'Shape'],
    media: [
      {
        type: 'image',
        src: 'img/dragon.jpg',
      },
      {
        type: 'image',
        src: 'img/dragon_mechanism.jpg',
      },
      {
        type: 'video',
        src: 'https://www.youtube.com/watch?v=Wf1Ls4M2afg',
      },
    ],
    doi: '10.1145/3290605.3300441',
    publication: 'ACM CHI',
    year: '2019',
    audit: {
      score: 3,
      ticks_str: '3',
      sensations: ['Resistance', 'Weight magnitude', 'Shape'],
      status: 'auditable',
    },
  },
  {
    name: 'ShapeSense',
    category: 'Aerodynamic resistance',
    author: 'Yuhu Liu, Takeru Hashimoto, Shigeo Yoshida, Takuji Narumi, Tomohiro Tanikawa, Michitaka Hirose',
    title:
      'ShapeSense: a 2D shape rendering VR device with moving surfaces that controls mass properties and air resistance',
    mechanism: 'Two surfaces slide along the shaft to alter mass distribution and air resistance, rendering 2D shapes.',
    useCaseText:
      'Providing dynamic 2D shape and inertia feedback by altering aerodynamic resistance and mass distribution.',
    useCaseTags: ['Shape cues', 'Resistance cues', 'Weight distribution cues'],
    generalUseCases: ['Gaming', 'VR shape rendering', 'Training'],
    submodalities: ['Shape', 'Resistance', 'Weight distribution'],
    media: [
      {
        type: 'image',
        src: 'img/shapesense.jpg',
      },
      {
        type: 'image',
        src: 'img/shapesense_mechanism.jpg',
      },
      {
        type: 'video',
        src: 'https://www.youtube.com/watch?v=RYP4salOgJ8',
      },
    ],
    doi: '10.1145/3305367.3327991',
    publication: 'ACM SIGGRAPH Emerging Tech',
    year: '2019',
    audit: {
      score: 1,
      ticks_str: '1',
      sensations: ['Shape'],
      status: 'updated',
    },
  },
  {
    name: 'AirCharge',
    category: 'Compressed air release',
    author:
      'Po-Yu Chen, Ching-Yi Tsai, Wei-Hsin Wang, Chao-Jung Lai, Chia-An Fan, Shih-Chin Lin, Chia-Chen Chi, Mike Y. Chen',
    title: 'AirCharge: Amplifying Ungrounded Impact Force by Accumulating Air Propulsion Momentum',
    mechanism: 'Compressed air jets on rotating swingarms accumulate momentum to amplify ungrounded impact tenfold.',
    useCaseText:
      'Rendering sharp ballistic and sports impacts such as baseball swings, tennis smashes, and physical weapon collisions in VR.',
    useCaseTags: ['Impact cues', 'Ballistic collisions', 'Sports simulation'],
    generalUseCases: ['Gaming', 'Sports Simulation', 'Training'],
    submodalities: ['Impact'],
    media: [
      {
        type: 'image',
        src: 'img/aircharge.jpg',
        caption:
          'AirCharge prototype mounted on HTC Vive controller with high-speed air propulsion swingarms',
      },
      {
        type: 'image',
        src: 'img/aircharge_mechanism.jpg',
        caption:
          'Momentum accumulation mechanism diagram (A), swing dynamics (B), and benchmark force vs. time profile delivering 40 N peak impact in 3 ms (C)',
      },
    ],
    doi: '10.1145/3586183.3606768',
    publication: 'UIST',
    year: '2023',
    audit: {
      score: 1,
      ticks_str: '1',
      sensations: ['Impact'],
      status: 'auditable',
    },
  },
  {
    name: 'AirRacket',
    category: 'Compressed air release',
    author: 'Ching-Yi Tsai, I-Lun Tsai, Chao-Jung Lai, Derrek Chow, Lauren Wei, Lung-Pan Cheng, Mike Y. Chen',
    title:
      'AirRacket: Perceptual Design of Ungrounded, Directional Force Feedback to Improve Virtual Racket Sports Experiences',
    mechanism: 'Compressed air jets deliver directional racket impacts, tuned for ping-pong, badminton and tennis.',
    useCaseText:
      'Simulating realistic directional impact forces during virtual racket sports including table tennis, badminton, and tennis.',
    useCaseTags: ['Directional impact', 'Racket sports', 'Perceptual force scaling'],
    generalUseCases: ['Gaming', 'Sports Simulation', 'Training'],
    submodalities: ['Impact'],
    media: [
      {
        type: 'image',
        src: 'img/airracket.jpg',
        caption:
          'AirRacket prototypes for table tennis, badminton, and tennis firing directional air propulsion jets during VR gameplay',
      },
      {
        type: 'image',
        src: 'img/airracket_mechanism.jpg',
        caption:
          'AirRacket pneumatic backpack architecture (air tank, regulator, Arduino, solenoids) and carbon fiber racket shaft layouts',
      },
      {
        type: 'video',
        src: 'https://www.youtube.com/watch?v=m8_TBtBHGMM',
        caption: 'AirRacket CHI 2022 Best Paper presentation and live VR sports evaluation',
      },
    ],
    doi: '10.1145/3491102.3502034',
    publication: 'CHI',
    year: '2022',
    audit: {
      score: 1,
      ticks_str: '1',
      sensations: ['Impact'],
      status: 'auditable',
    },
  },
  {
    name: 'JetController',
    category: 'Compressed air release',
    author:
      'Yu-Wei Wang, Yu-Hsin Lin, Pin-Sung Ku, Yōko Miyatake, Yi-Hsuan Mao, Po-Yu Chen, Chun-Miao Tseng, Mike Y. Chen',
    title: 'JetController: High-Speed Ungrounded 3-DoF Force Feedback Controllers Using Air Propulsion Jets',
    mechanism: 'Air propulsion jets give high-speed 3-DoF force, preferred over vibrating controllers by 88% of users.',
    useCaseText:
      'High-speed recoil and resistance sensations for virtual firearm firing, melee slicing, and vehicle driving in VR.',
    useCaseTags: ['3-DoF propulsion', 'High-speed impulses', 'Weapon recoil'],
    generalUseCases: ['Gaming', 'Virtual Reality', 'Training'],
    submodalities: ['Impact'],
    media: [
      {
        type: 'image',
        src: 'img/jetcontroller.jpg',
        caption: 'JetController 5-nozzle manifold architecture mounted on handheld VR controller',
      },
      {
        type: 'image',
        src: 'img/jetcontroller_mechanism.jpg',
        caption:
          'JetController 3D (XYZ) nozzle configuration CAD model (left) and high-speed solenoid valve manifold pneumatic benchtop system (right)',
      },
      {
        type: 'video',
        src: 'https://www.youtube.com/watch?v=h66RdzbH6ko',
        caption: 'JetController ACM CHI 2021 video presentation demonstrating 3-DoF force feedback in VR',
      },
    ],
    doi: '10.1145/3411764.3445549',
    publication: 'CHI',
    year: '2021',
    audit: {
      score: 1,
      ticks_str: '1',
      sensations: ['Impact'],
      status: 'auditable',
    },
  },
  {
    name: 'HairTouch',
    category: 'Flexible surface deformation',
    author: 'Chi-Jung Lee, Hsin-Ruey Tsai, Bing-Yu Chen',
    title:
      'HairTouch: Providing Stiffness, Roughness and Surface Height Differences Using Reconfigurable Brush Hairs on a VR Controller',
    mechanism: 'Servos reset the free length of brush hairs, varying stiffness, roughness and surface height.',
    useCaseText:
      'Rendering tactile stiffness, texture roughness, and geometry height when touching virtual materials and fur in VR.',
    useCaseTags: ['Stiffness cues', 'Friction cues', 'Shape cues'],
    generalUseCases: ['Gaming', 'Material texture rendering', 'Virtual pet interaction'],
    submodalities: ['Stiffness', 'Friction', 'Shape'],
    media: [
      {
        type: 'image',
        src: 'img/hairtouch.jpg',
      },
      {
        type: 'image',
        src: 'img/hairtouch_mechanism.jpg',
      },
      {
        type: 'video',
        src: 'https://www.youtube.com/watch?v=Ud44WUzDN8o',
      },
    ],
    doi: '10.1145/3411764.3445285',
    publication: 'ACM CHI',
    year: '2021',
    audit: {
      score: 3,
      ticks_str: '3',
      sensations: ['Stiffness', 'Friction', 'Shape'],
      status: 'group queried',
    },
  },
  {
    name: 'TapeTouch',
    category: 'Flexible surface deformation',
    author: 'Lifeng Zhu, Xudong Jiang, Jiangwei Shen, Heng Zhang, Yiting Mo, Aiguo Song',
    title: 'TapeTouch: A Handheld Shape-changing Device for Haptic Display of Soft Objects',
    mechanism: 'Motors bend elastic brass tapes, whose compliance renders the softness and form of virtual objects.',
    useCaseText:
      'Providing real-time shape curvature and variable softness compliance when touching soft virtual objects.',
    useCaseTags: ['Stiffness cues', 'Shape cues'],
    generalUseCases: ['Gaming', 'VR soft object simulation', 'Training'],
    submodalities: ['Stiffness', 'Shape'],
    media: [
      {
        type: 'image',
        src: 'img/tapetouch.jpg',
      },
      {
        type: 'image',
        src: 'img/tapetouch_mechanism.jpg',
      },
    ],
    doi: '10.1109/tvcg.2022.3203087',
    publication: 'IEEE TVCG',
    year: '2022',
    audit: {
      score: 2,
      ticks_str: '2',
      sensations: ['Stiffness', 'Shape'],
      status: 'updated',
    },
  },
  {
    name: 'Haptic Handshank',
    category: 'Flexible surface deformation',
    author: 'K. M. Arafat Aziz, Hu Luo, Lehiany Asma, Weiliang Xu, Yuru Zhang, Dangxiao Wang',
    title: 'Haptic Handshank – A Handheld Multimodal Haptic Feedback Controller for Virtual Reality',
    mechanism: 'A silicone airbag inflates for softness, with a Peltier cell for temperature and a motor for vibration.',
    useCaseText:
      'Rendering synchronized multimodal thermal, compliance, and vibrotactile feedback during handheld virtual reality interactions.',
    useCaseTags: ['Thermal cues', 'Stiffness cues', 'Vibration cues'],
    generalUseCases: ['Gaming', 'Virtual reality simulation', 'Multimodal training'],
    submodalities: ['Thermal', 'Stiffness', 'Vibration'],
    media: [
      {
        type: 'image',
        src: 'img/haptic_handshank.png',
      },
      {
        type: 'image',
        src: 'img/haptic_handshank_mechanism.jpg',
      },
    ],
    doi: '10.1109/ismar50242.2020.00047',
    publication: 'IEEE ISMAR',
    year: '2020',
    audit: {
      score: 3,
      ticks_str: '3',
      sensations: ['Thermal', 'Stiffness', 'Vibration'],
      status: 'group queried',
    },
  },
  {
    name: 'CapstanCrunch',
    category: 'Joint actuation',
    author: 'Mike Sinclair, Eyal Ofek, Mar Gonzalez-Franco, Christian Holz',
    title: 'CapstanCrunch: A Haptic VR Controller with User-supplied Force Feedback',
    mechanism: "A capstan brake clutches a built-in spring, so the user's own grip supplies the rendered compliance.",
    useCaseText:
      'Providing high-force resistive stiffness and variable compliance when grasping virtual objects.',
    useCaseTags: ['Stiffness cues'],
    generalUseCases: ['Gaming', 'Virtual object manipulation', 'Training'],
    submodalities: ['Stiffness'],
    media: [
      {
        type: 'image',
        src: 'img/capstancrunch.jpg',
      },
      {
        type: 'image',
        src: 'img/capstancrunch_mechanism.jpg',
      },
      {
        type: 'video',
        src: 'https://www.youtube.com/watch?v=btZoEgiwRA0',
      },
    ],
    doi: '10.1145/3332165.3347891',
    publication: 'ACM UIST',
    year: '2019',
    audit: {
      score: 1,
      ticks_str: '1',
      sensations: ['Stiffness'],
      status: 'auditable',
    },
  },
  {
    name: 'CLAW',
    category: 'Joint actuation',
    author: 'Inrak Choi, Eyal Ofek, Hrvoje Benko, Mike Sinclair, Christian Holz',
    title:
      'CLAW: A Multifunctional Handheld Haptic Controller for Grasping, Touching, and Triggering in Virtual Reality',
    mechanism: 'A servo arm resists the index finger for grasping, with a voice coil adding texture and trigger impact.',
    useCaseText:
      'Rendering multimodal grasping stiffness, surface touching textures, and firearm trigger recoil.',
    useCaseTags: ['Stiffness cues', 'Vibration cues', 'Impact cues', 'Shape cues'],
    generalUseCases: ['Gaming', 'Tool interaction', 'Virtual reality simulation'],
    submodalities: ['Stiffness', 'Vibration', 'Impact', 'Shape'],
    media: [
      {
        type: 'image',
        src: 'img/claw.jpg',
      },
      {
        type: 'image',
        src: 'img/claw_mechanism.jpg',
      },
      {
        type: 'video',
        src: 'https://www.youtube.com/watch?v=8BZ1JnnBwgI',
      },
    ],
    doi: '10.1145/3173574.3174228',
    publication: 'ACM CHI',
    year: '2018',
    audit: {
      score: 4,
      ticks_str: '4',
      sensations: ['Stiffness', 'Vibration', 'Impact', 'Shape'],
      status: 'priority',
    },
  },
  {
    name: 'HapLinkage',
    category: 'Joint actuation',
    author: 'Nianlong Li, Han-Jong Kim, Luyao Shen, Feng Tian, Teng Han, Xing-Dong Yang, Tek-Jin Nam',
    title: 'HapLinkage: Prototyping Haptic Proxies for Virtual Hand Tools Using Linkage Mechanism',
    mechanism: 'Motor-driven linkage mechanisms resist the hand, prototyping the feel of virtual hand tools.',
    useCaseText:
      'Prototyping dynamic kinetic motions and joint resistance forces for virtual handheld tools.',
    useCaseTags: ['Resistance cues'],
    generalUseCases: ['Tool prototyping', 'Virtual training', 'Gaming'],
    submodalities: ['Resistance'],
    media: [
      {
        type: 'image',
        src: 'img/haplinkage.jpg',
      },
      {
        type: 'image',
        src: 'img/haplinkage_mechanism.jpg',
      },
      {
        type: 'video',
        src: 'https://www.youtube.com/watch?v=3Hvr54iOArU',
      },
    ],
    doi: '10.1145/3379337.3415812',
    publication: 'ACM UIST',
    year: '2020',
    audit: {
      score: 1,
      ticks_str: '1',
      sensations: ['Resistance'],
      status: 'updated',
    },
  },
  {
    name: 'Haptic Links',
    category: 'Joint actuation',
    author: 'Evan Strasnick, Christian Holz, Eyal Ofek, Mike Sinclair, Hrvoje Benko',
    title: 'Haptic Links: Bimanual Haptics for Virtual Reality Using Variable Stiffness Actuation',
    mechanism: 'Variable-stiffness brakes lock the relative motion of two controllers into one bimanual object.',
    useCaseText:
      'Transforming two handheld VR controllers into rigid two-handed tools, bows, weapons, or constrained mechanisms.',
    useCaseTags: ['Resistance cues', 'Shape cues'],
    generalUseCases: ['Gaming', 'Bimanual interaction', 'Tool simulation'],
    submodalities: ['Resistance', 'Shape'],
    media: [
      {
        type: 'image',
        src: 'img/hapticlinks.jpg',
      },
      {
        type: 'image',
        src: 'img/hapticlinks_mechanism.jpg',
      },
      {
        type: 'video',
        src: 'https://www.youtube.com/watch?v=aMkYJ0fKLEo',
      },
    ],
    doi: '10.1145/3173574.3174218',
    publication: 'ACM CHI',
    year: '2018',
    audit: {
      score: 2,
      ticks_str: '2',
      sensations: ['Resistance', 'Shape'],
      status: 'auditable',
    },
  },
  {
    name: 'ElaStick',
    category: 'Band elasticity control',
    author: 'Neung Ryu, Woojin Lee, Myung Jin Kim, Andrea Bianchi',
    title:
      'ElaStick: A Handheld Variable Stiffness Display for Rendering Dynamic Haptic Response of Flexible Object',
    mechanism: 'Four servos wind spools to tune four elastic tendons, rendering the flex of dynamic flexible objects.',
    useCaseText:
      'Simulating the dynamic bending compliance, stiffness, and oscillation of flexible objects and tools in VR.',
    useCaseTags: ['Stiffness cues', 'Shape cues'],
    generalUseCases: ['Gaming', 'Flexible object simulation', 'Virtual sports'],
    submodalities: ['Stiffness', 'Shape'],
    media: [
      {
        type: 'image',
        src: 'img/elastick.jpg',
      },
      {
        type: 'image',
        src: 'img/elastick_mechanism.jpg',
      },
      {
        type: 'video',
        src: 'https://www.youtube.com/watch?v=kkDMDuDpv9s',
      },
    ],
    doi: '10.1145/3379337.3415862',
    publication: 'ACM UIST',
    year: '2020',
    audit: {
      score: 2,
      ticks_str: '2',
      sensations: ['Stiffness', 'Shape'],
      status: 'auditable',
    },
  },
  {
    name: 'ElastiLinks',
    category: 'Band elasticity control',
    author: 'Tzu-Yun Wei, Hsin-Ruey Tsai, Yu-So Liao, Chieh Tsai, Yi-Shan Chen, Chi Wang, Bing-Yu Chen',
    title: 'ElastiLinks: Force Feedback between VR Controllers with Dynamic Points of Application of Force',
    mechanism: 'A motor winds an elastic band between two controllers, changing its length and resistive force level.',
    useCaseText:
      'Providing bimanual kinesthetic resistance and torque sensations with dynamic application points (e.g., archery bow, slingshot).',
    useCaseTags: ['Impact cues', 'Resistance cues'],
    generalUseCases: ['Gaming', 'Bimanual interaction', 'Training'],
    submodalities: ['Impact', 'Resistance'],
    media: [
      {
        type: 'image',
        src: 'img/elastilinks.jpg',
      },
      {
        type: 'image',
        src: 'img/elastilinks_mechanism.jpg',
      },
      {
        type: 'video',
        src: 'https://www.youtube.com/watch?v=VsMw4QpSgiA',
      },
    ],
    doi: '10.1145/3379337.3415836',
    publication: 'ACM UIST',
    year: '2020',
    audit: {
      score: 2,
      ticks_str: '2',
      sensations: ['Impact', 'Resistance'],
      status: 'auditable',
    },
  },
  {
    name: 'ElastOscillation',
    category: 'Band elasticity control',
    author: 'Hsin-Ruey Tsai, Ching-Wen Hung, Tzu-Chun Wu, Bing-Yu Chen',
    title: 'ElastOscillation: 3D Multilevel Force Feedback for Damped Oscillation on VR Controllers',
    mechanism: 'Elastic bands damp a bouncing proxy, so the moving mass reads as a shifting centre of mass.',
    useCaseText:
      'Rendering 3D damped oscillations, bouncing effects, and mass dynamics during virtual object manipulation.',
    useCaseTags: ['Weight distribution cues'],
    generalUseCases: ['Gaming', 'Object physics simulation', 'Training'],
    submodalities: ['Weight distribution'],
    media: [
      {
        type: 'image',
        src: 'img/elastoscillation.jpg',
      },
      {
        type: 'image',
        src: 'img/elastoscillation_mechanism.jpg',
      },
      {
        type: 'video',
        src: 'https://www.youtube.com/watch?v=Za-yDqn1tgc',
      },
    ],
    doi: '10.1145/3313831.3376408',
    publication: 'ACM CHI',
    year: '2020',
    audit: {
      score: 1,
      ticks_str: '1',
      sensations: ['Weight distribution'],
      status: 'updated',
    },
  },
  {
    name: 'Bstick',
    category: 'Pin extension',
    author: 'Ginam Ko, Jaeseok Yoon, Byungseok Jung, SangHun Nam',
    title:
      'Variable Offset Method Based on Five-finger Pressure to Enhance Weight Perception in Virtual Reality',
    mechanism: 'Five micro linear actuators resist each finger up to 22 N, with a vibrator in the grip module.',
    useCaseText:
      'Rendering individual finger contact compliance, active gripping stiffness, and dynamic weight perception in VR.',
    useCaseTags: ['Stiffness cues', 'Vibration cues'],
    generalUseCases: ['Gaming', 'Virtual grasping', 'Training'],
    submodalities: ['Stiffness', 'Vibration'],
    media: [
      {
        type: 'image',
        src: 'img/bstick.png',
      },
      {
        type: 'image',
        src: 'img/bstick_mechanism.jpg',
      },
      {
        type: 'video',
        src: 'https://www.youtube.com/watch?v=ga5Op0fq9NU',
      },
    ],
    doi: '10.1145/3588028.3603654',
    publication: 'ACM SIGGRAPH',
    year: '2023',
    audit: {
      score: 2,
      ticks_str: '2',
      sensations: ['Stiffness', 'Vibration'],
      status: 'updated',
    },
  },
  {
    name: 'HaptiVec',
    category: 'Pin extension',
    author: 'Daniel K. Y. Chen, Jean-Baptiste Chossat, Peter B. Shull',
    title:
      'HaptiVec: Presenting Haptic Feedback Vectors in Handheld Controllers using Embedded Tactile Pin Arrays',
    mechanism: 'A 3 by 5 embedded pin array presses directional pressure vectors into the fingers and palm.',
    useCaseText:
      'Presenting directional force vectors, projectile impact cues, and environmental tactile feedback (e.g. rain) in handheld VR.',
    useCaseTags: ['Impact cues'],
    generalUseCases: ['Gaming', 'Shooting simulation', 'Directional cues'],
    submodalities: ['Impact'],
    media: [
      {
        type: 'image',
        src: 'img/haptivec.jpg',
      },
      {
        type: 'image',
        src: 'img/haptivec_mechanism.jpg',
      },
      {
        type: 'video',
        src: 'https://www.youtube.com/watch?v=eBcRnL91buI',
      },
    ],
    doi: '10.1145/3290605.3300401',
    publication: 'ACM CHI',
    year: '2019',
    audit: {
      score: 1,
      ticks_str: '1',
      sensations: ['Impact'],
      status: 'auditable',
    },
  },
  {
    name: 'PoCoPo',
    category: 'Pin extension',
    author: 'Shigeo Yoshida, Yuqian Sun, Hideaki Kuzuoka',
    title: 'PoCoPo: Handheld Pin-based Shape Display for Haptic Rendering in Virtual Reality',
    mechanism: '36 pins across two opposing faces render 2.5D shapes in the hand, recognised 88.5% without vision.',
    useCaseText:
      'Rendering 2.5D object shapes, physical tool profiles, and tangible interface components in VR without visual aid.',
    useCaseTags: ['Shape cues'],
    generalUseCases: ['Gaming', 'Tactile shape exploration', 'Virtual tool interaction'],
    submodalities: ['Shape'],
    media: [
      {
        type: 'image',
        src: 'img/pocopo.jpg',
      },
      {
        type: 'image',
        src: 'img/pocopo_mechanism.jpg',
      },
      {
        type: 'video',
        src: 'https://www.youtube.com/watch?v=_lL34qC3-q0',
      },
    ],
    doi: '10.1145/3313831.3376358',
    publication: 'ACM CHI',
    year: '2020',
    audit: {
      score: 1,
      ticks_str: '1',
      sensations: ['Shape'],
      status: 'auditable',
    },
  },
  {
    name: 'TextureTouch',
    category: 'Pin extension',
    author: 'Hrvoje Benko, Christian Holz, Mike Sinclair, Eyal Ofek',
    title:
      'NormalTouch and TextureTouch: High-fidelity 3D Haptic Shape Rendering on Handheld Virtual Reality Controllers',
    mechanism: 'A 4 by 4 matrix of actuated pins renders object shape including detailed surface structure.',
    useCaseText:
      "Rendering high-fidelity 3D geometric shape details and surface textures directly against the user's fingertip.",
    useCaseTags: ['Shape cues'],
    generalUseCases: ['Virtual texture inspection', 'Gaming', 'Tactile rendering'],
    submodalities: ['Shape'],
    media: [
      {
        type: 'image',
        src: 'img/texturetouch.jpg',
      },
      {
        type: 'image',
        src: 'img/texturetouch_mechanism.jpg',
      },
      {
        type: 'video',
        src: 'https://www.youtube.com/watch?v=KhbUg3_3T0I',
      },
    ],
    doi: '10.1145/2984511.2984526',
    publication: 'ACM UIST',
    year: '2016',
    audit: {
      score: 1,
      ticks_str: '1',
      sensations: ['Shape'],
      status: 'added',
    },
  },
  {
    name: 'Chanbara',
    category: 'Flywheel torque',
    author: 'Daijiro Koga, Takahiro Itagaki',
    title: 'Virtual Chanbara',
    mechanism: 'The earliest flywheel device here: braking a spinning wheel delivers sword-strike impact in VR.',
    useCaseText:
      'Simulating rigid sword collisions, slashing weapon impacts, and martial arts combat in virtual reality.',
    useCaseTags: ['Impact cues', 'Weapon combat', 'Flywheel braking'],
    generalUseCases: ['Gaming', 'Training'],
    submodalities: ['Impact'],
    media: [
      {
        type: 'image',
        src: 'img/chanbara.jpg',
      },
      {
        type: 'image',
        src: 'img/chanbara_mechanism.jpg',
      },
    ],
    doi: '10.1145/1242073.1242118',
    publication: 'ACM SIGGRAPH',
    year: '2002',
    audit: {
      score: 1,
      ticks_str: '1',
      sensations: ['Impact'],
      status: 'added',
    },
  },
  {
    name: 'HapticWhirl',
    category: 'Flywheel torque',
    author: '',
    title: '',
    mechanism: 'A gimballed flywheel tilts to steer gyroscopic torque across impact, motion and resistance cues.',
    useCaseText:
      'Providing active vibration, impact, motion, resistance cues in virtual reality interactions.',
    useCaseTags: ['Vibration cues', 'Impact cues', 'Motion cues', 'Resistance cues'],
    generalUseCases: ['Gaming', 'Training'],
    submodalities: ['Vibration', 'Impact', 'Motion', 'Resistance'],
    media: [
      {
        type: 'image',
        src: 'img/hapticwhirl.png',
      },
      {
        type: 'image',
        src: 'img/hapticwhirl_mechanism.png',
      },
    ],
    doi: '',
    publication: '',
    year: '',
    audit: {
      score: 4,
      ticks_str: '4',
      sensations: ['Vibration', 'Impact', 'Motion', 'Resistance'],
      status: 'auditable',
    },
  },
  {
    name: 'iTorqU 2.1',
    category: 'Flywheel torque',
    author: 'Kyle N. Winfree, Joseph M. Romano, Jamie Gewirtz, Katherine J. Kuchenbecker',
    title: 'Control of a High-Fidelity Ungrounded Torque Feedback Device: The iTorqU 2.1',
    mechanism: 'A gimballed flywheel redirects its spin axis, producing torque that pulls the hand in a direction.',
    useCaseText:
      'Rendering directional kinesthetic guidance, rotational resistance, and ungrounded steering forces in virtual space.',
    useCaseTags: ['Motion cues', 'Gyroscopic precession', 'Torque guidance'],
    generalUseCases: ['Gaming', 'Training'],
    submodalities: ['Motion'],
    media: [
      {
        type: 'image',
        src: 'img/itorqu.jpg',
      },
      {
        type: 'image',
        src: 'img/itorqu_mechanism.jpg',
      },
    ],
    doi: '10.1109/ROBOT.2010.5509485',
    publication: 'IEEE ICRA',
    year: '2010',
    audit: {
      score: 1,
      ticks_str: '1',
      sensations: ['Motion'],
      status: 'pending',
    },
  },
  {
    name: 'MetamorphX',
    category: 'Flywheel torque',
    author: 'Takeru Hashimoto, Shigeo Yoshida, Takuji Narumi',
    title:
      'MetamorphX: An Ungrounded 3-DoF Moment Display that Changes its Physical Properties through Rotational Impedance Control',
    mechanism: 'Opposed gyroscopes generate 3-DoF moment, changing the inertia and viscosity of the wielded object.',
    useCaseText:
      'Simulating dynamic object inertia, fluid viscosity, and changing rotational resistance of virtual tools.',
    useCaseTags: ['Resistance cues', 'Rotational inertia', 'Control moment gyroscope'],
    generalUseCases: ['Gaming', 'Training'],
    submodalities: ['Resistance'],
    media: [
      {
        type: 'image',
        src: 'img/metamorphx.png',
      },
      {
        type: 'image',
        src: 'img/metamorphx_mechanism.png',
      },
    ],
    doi: '10.1145/3526113.3545650',
    publication: 'ACM UIST',
    year: '2022',
    audit: {
      score: 1,
      ticks_str: '1',
      sensations: ['Resistance'],
      status: 'pending',
    },
  },
  {
    name: 'Sobue et al.',
    category: 'Flywheel torque',
    author: 'Michiru Sobue, Soma Kato, Izumi Mizoguchi, Hiroyuki Kajimoto',
    title: 'Presentation of Hitting Sensation to the Racket by a Single DC Motor Embedded in a Handle',
    mechanism: 'A motor driver brakes the spinning rotor abruptly, and the reverse torque reads as an impact.',
    useCaseText:
      'Rendering realistic racket ball collisions and transient impact shocks in VR sports simulators.',
    useCaseTags: ['Impact cues', 'VR racket sports', 'Motor inertia pulse'],
    generalUseCases: ['Gaming', 'Training'],
    submodalities: ['Impact'],
    media: [
      {
        type: 'image',
        src: 'img/sobue.png',
      },
      {
        type: 'image',
        src: 'img/sobue_mechanism.png',
      },
    ],
    doi: '10.1109/HAPTICS59260.2024.10520849',
    publication: 'IEEE HAPTICS',
    year: '2024',
    audit: {
      score: 1,
      ticks_str: '1',
      sensations: ['Impact'],
      status: 'updated',
    },
  },
  {
    name: 'SpinShot',
    category: 'Flywheel torque',
    author: '',
    title: '',
    mechanism: 'A flywheel is fired and braked to produce directional impact, optimised for physical and felt force.',
    useCaseText: 'Providing active impact cues in virtual reality interactions.',
    useCaseTags: ['Impact cues'],
    generalUseCases: ['Gaming', 'Training'],
    submodalities: ['Impact'],
    media: [
      {
        type: 'image',
        src: 'img/spinshot.jpg',
      },
      {
        type: 'image',
        src: 'img/spinshot_mechanism.jpg',
      },
    ],
    doi: '',
    publication: '',
    year: '',
    audit: {
      score: 1,
      ticks_str: '1',
      sensations: ['Impact'],
      status: 'updated',
    },
  },
  {
    name: 'TorqueCapsules',
    category: 'Flywheel torque',
    author: '',
    title: '',
    mechanism: 'Fully encapsulated flywheel modules attach to objects, prototyping kinesthetic and movement cues.',
    useCaseText: 'Providing active impact, resistance cues in virtual reality interactions.',
    useCaseTags: ['Impact cues', 'Resistance cues'],
    generalUseCases: ['Gaming', 'Training'],
    submodalities: ['Impact', 'Resistance'],
    media: [
      {
        type: 'image',
        src: 'img/torquecapsules.jpg',
      },
      {
        type: 'image',
        src: 'img/torquecapsules_mechanism.jpg',
      },
    ],
    doi: '',
    publication: '',
    year: '',
    audit: {
      score: 2,
      ticks_str: '2',
      sensations: ['Impact', 'Resistance'],
      status: 'auditable',
    },
  },
  {
    name: 'HaptiCraft',
    category: 'Exchangeable actuator modules',
    author: 'Chaeyong Park, Jeongwoo Kim, Jinsoo Kim, Seungmoon Choi',
    title: 'HaptiCraft: A Modular Multimodal Haptic Controller for Immersive Virtual Reality Interactions',
    mechanism: 'Swappable cube modules add vibration, impact, thermal and MR-fluid stiffness to one controller.',
    useCaseText:
      'Rendering multimodal tactile and kinesthetic sensations (heat/cold, impact, stiffness, vibrations) by interchanging hardware modules.',
    useCaseTags: ['Thermal cues', 'Stiffness cues', 'Vibration cues', 'Impact cues'],
    generalUseCases: ['Gaming', 'Modular controller design', 'VR interaction authoring'],
    submodalities: ['Thermal', 'Stiffness', 'Vibration', 'Impact'],
    media: [
      {
        type: 'image',
        src: 'img/hapticraft.jpg',
      },
      {
        type: 'image',
        src: 'img/hapticraft_mechanism.jpg',
      },
      {
        type: 'video',
        src: 'https://www.youtube.com/watch?v=UWZDeVB9AT0',
      },
    ],
    doi: '10.1109/tvcg.2024.11481658',
    publication: 'IEEE TVCG',
    year: '2024',
    audit: {
      score: 4,
      ticks_str: '4',
      sensations: ['Thermal', 'Stiffness', 'Vibration', 'Impact'],
      status: 'auditable',
    },
  },
  {
    name: 'SensoryBlox',
    category: 'Exchangeable actuator modules',
    author: 'Hyunjae Gil, Abbas Khawaja, Ben Cressman, Andrew Gerungan, Jin Ryong Kim',
    title: 'SensoryBlox: Plug-and-Feel Modular Multi-Sensory User Interface for Immersive Cardboard VR',
    mechanism: 'Plug-and-feel modules clip onto a cardboard VR viewer, adding thermal and vibrotactile channels.',
    useCaseText:
      'Adding affordable, reconfigurable thermal and vibrotactile sensory feedback to low-cost VR headsets and handhelds.',
    useCaseTags: ['Thermal cues', 'Vibration cues'],
    generalUseCases: ['Affordable VR', 'Modular education', 'Gaming'],
    submodalities: ['Thermal', 'Vibration'],
    media: [
      {
        type: 'image',
        src: 'img/sensoryblox.jpg',
      },
      {
        type: 'image',
        src: 'img/sensoryblox_mechanism.jpg',
      },
      {
        type: 'video',
        src: 'https://www.youtube.com/watch?v=v4jbfg_5qjU',
      },
    ],
    doi: '10.1145/3772318.3791596',
    publication: 'ACM CHI',
    year: '2024',
    audit: {
      score: 2,
      ticks_str: '2',
      sensations: ['Thermal', 'Vibration'],
      status: 'auditable',
    },
  },
  {
    name: 'VoxelHap',
    category: 'Exchangeable actuator modules',
    author: 'Martin Feick, Cihan Biyikli, Kiran Gani, Anton Wittig, Anthony Tang, Antonio Krüger',
    title:
      'VoxelHap: A Toolkit for Constructing Proxies Providing Tactile and Kinesthetic Haptic Feedback in Virtual Reality',
    mechanism: 'Actuated voxels assemble into proxies, mixing tactile vibration with kinesthetic resistance.',
    useCaseText:
      'Constructing modular physical props and proxies that combine tactile textures with kinesthetic resistance for VR tools.',
    useCaseTags: ['Vibration cues', 'Resistance cues'],
    generalUseCases: ['VR prop construction', 'Tool prototyping', 'Gaming'],
    submodalities: ['Vibration', 'Resistance'],
    media: [
      {
        type: 'image',
        src: 'img/voxelhap.jpg',
      },
      {
        type: 'image',
        src: 'img/voxelhap_mechanism.jpg',
      },
    ],
    doi: '10.1145/3586183.3606722',
    publication: 'ACM UIST',
    year: '2023',
    audit: {
      score: 2,
      ticks_str: '2',
      sensations: ['Vibration', 'Resistance'],
      status: 'auditable',
    },
  },
  {
    name: 'FluidWeight',
    category: 'Liquid mass shifting',
    author: 'Diego Monteiro et al.',
    title:
      'Design and Development of a Low-cost Device for Weight and Center of Gravity Simulation in Virtual Reality',
    mechanism: 'Pumps move water between reservoirs to change both total weight and the centre of gravity.',
    useCaseText:
      'Simulating dynamic heft, shifting balance, and fluid inertia across diverse virtual objects in VR.',
    useCaseTags: ['Weight magnitude cues', 'Weight distribution cues', 'Shape cues'],
    generalUseCases: ['Gaming', 'Training'],
    submodalities: ['Weight magnitude', 'Weight distribution', 'Shape'],
    media: [
      {
        type: 'image',
        src: 'img/fluidweight.png',
      },
      {
        type: 'image',
        src: 'img/fluidweight_mechanism.png',
      },
    ],
    doi: '10.1145/3462244.3479907',
    publication: 'ACM ICMI',
    year: '2021',
    audit: {
      score: 3,
      ticks_str: '3',
      sensations: ['Weight magnitude', 'Weight distribution', 'Shape'],
      status: 'pending',
    },
  },
  {
    name: 'GravityCup',
    category: 'Liquid mass shifting',
    author: 'Chih-Hao Cheng et al.',
    title: 'GravityCup: A liquid-based haptics for simulating dynamic weight in virtual reality',
    mechanism: 'Water is pumped into and out of a cup so its weight changes as the virtual vessel fills.',
    useCaseText:
      'Simulating dynamic liquid volume, scooping, and container weight changes in virtual reality.',
    useCaseTags: ['Weight magnitude cues', 'Shape cues'],
    generalUseCases: ['Gaming', 'Training'],
    submodalities: ['Weight magnitude', 'Shape'],
    media: [
      {
        type: 'image',
        src: 'img/gravitycup.jpg',
      },
      {
        type: 'video',
        src: 'https://www.youtube.com/watch?v=IukNXxwoprI',
      },
      {
        type: 'image',
        src: 'img/gravitycup_mechanism.jpg',
      },
    ],
    doi: '10.1145/3281505.3281569',
    publication: 'ACM VRST',
    year: '2018',
    audit: {
      score: 2,
      ticks_str: '2',
      sensations: ['Weight magnitude', 'Shape'],
      status: 'pending',
    },
  },
  {
    name: 'MobileGravity',
    category: 'Liquid mass shifting',
    author: 'Alexander Kalus et al.',
    title: 'MobileGravity: Mobile Simulation of a High Range of Weight in Virtual Reality',
    mechanism: 'Liquid transfers in and out of the device to render a high range of absolute weight while mobile.',
    useCaseText:
      'Rendering a high range of realistic object weights in room-scale untethered virtual reality.',
    useCaseTags: ['Weight magnitude cues', 'Shape cues'],
    generalUseCases: ['Gaming', 'Training'],
    submodalities: ['Weight magnitude', 'Shape'],
    media: [
      {
        type: 'image',
        src: 'img/mobilegravity.jpg',
      },
      {
        type: 'video',
        src: 'https://www.youtube.com/watch?v=AnwGVFSCo8Q',
      },
      {
        type: 'image',
        src: 'img/mobilegravity_mechanism.jpg',
      },
    ],
    doi: '10.1145/3613904.3642658',
    publication: 'ACM CHI',
    year: '2024',
    audit: {
      score: 2,
      ticks_str: '2',
      sensations: ['Weight magnitude', 'Shape'],
      status: 'pending',
    },
  },
  {
    name: 'PumpVR',
    category: 'Liquid mass shifting',
    author: 'Alexander Kalus, Martin Kocur, Johannes Klein, Manuel Mayer, Niels Henze',
    title:
      'PumpVR: Rendering the Weight of Objects and Avatars through Liquid Mass Transfer in Virtual Reality',
    mechanism: "Liquid mass transfers between chambers to render the weight of objects and of the avatar's own limb.",
    useCaseText:
      'Dynamically altering absolute physical controller weight to render heavy objects, avatar limb fatigue, and fluid container filling in VR.',
    useCaseTags: ['Weight magnitude cues', 'Shape cues'],
    generalUseCases: ['Gaming', 'Virtual embodiment', 'Physical training'],
    submodalities: ['Weight magnitude', 'Shape'],
    media: [
      {
        type: 'image',
        src: 'img/pumpvr.jpg',
      },
      {
        type: 'image',
        src: 'img/pumpvr_mechanism.jpg',
      },
      {
        type: 'video',
        src: 'https://www.youtube.com/watch?v=q9ikP-Myop0',
      },
    ],
    doi: '10.1145/3544548.3581172',
    publication: 'ACM CHI',
    year: '2023',
    audit: {
      score: 2,
      ticks_str: '2',
      sensations: ['Weight magnitude', 'Shape'],
      status: 'pending',
    },
  },
  {
    name: 'VibroWeight',
    category: 'Liquid mass shifting',
    author: 'X. Wang, D. Vilela Monteiro, L.-H. Lee, P. Hui, H.-N. Liang',
    title:
      'VibroWeight: Simulating Weight and Center of Gravity Changes of Objects in Virtual Reality for Enhanced Realism',
    mechanism: 'Liquid shifts both total mass and its balance, while a voice coil adds vibration at contact.',
    useCaseText:
      'Rendering simultaneous weight magnitude shifts, 3D center-of-gravity redistribution, and vibrotactile contact feedback in VR.',
    useCaseTags: ['Vibration cues', 'Weight magnitude cues', 'Weight distribution cues', 'Shape cues'],
    generalUseCases: ['Gaming', 'Fluid simulation', 'Virtual training'],
    submodalities: ['Vibration', 'Weight magnitude', 'Weight distribution', 'Shape'],
    media: [
      {
        type: 'image',
        src: 'img/vibroweight.jpg',
      },
      {
        type: 'image',
        src: 'img/vibroweight_mechanism.jpg',
      },
      {
        type: 'video',
        src: 'https://www.youtube.com/watch?v=pZ3mPy0-MHw',
      },
    ],
    doi: '10.1109/haptics52436.2022.9765609',
    publication: 'IEEE Haptics Symposium',
    year: '2022',
    audit: {
      score: 4,
      ticks_str: '4',
      sensations: ['Vibration', 'Weight magnitude', 'Weight distribution', 'Shape'],
      status: 'priority',
    },
  },
  {
    name: 'Liu et al. (2023)',
    category: 'Solid mass shifting',
    author: 'Yuhu Liu et al.',
    title: 'Augmented Haptic VR Experience Combining Two Weight-Shifting Versatile Controllers',
    mechanism: 'A motorised reel raises and drops the mass vertically in two controllers for impact and vibration.',
    useCaseText:
      'Simulating versatile kinesthetic impacts, shifting mass balance, and two-handed multi-configuration tool interactions in VR.',
    useCaseTags: ['Vibration cues', 'Impact cues', 'Weight distribution cues'],
    generalUseCases: ['Gaming', 'Training'],
    submodalities: ['Vibration', 'Impact', 'Weight distribution'],
    media: [
      {
        type: 'image',
        src: 'img/liu2023.jpg',
      },
      {
        type: 'video',
        src: 'https://www.youtube.com/watch?v=C7SKKCUNVkw',
      },
      {
        type: 'image',
        src: 'img/liu2023_mechanism.jpg',
      },
    ],
    doi: '10.1145/3588037.3595399',
    publication: 'ACM SIGGRAPH Emerging Tech',
    year: '2023',
    audit: {
      score: 3,
      ticks_str: '3',
      sensations: ['Vibration', 'Impact', 'Weight distribution'],
      status: 'auditable',
    },
  },
  {
    name: 'Shifty',
    category: 'Solid mass shifting',
    author: 'André Zenner and Antonio Krüger',
    title:
      'Shifty: A Weight-Shifting Dynamic Passive Haptic Proxy to Enhance Object Perception in Virtual Reality',
    mechanism: 'A motor slides an internal weight along a rod, altering perceived length, thickness and heaviness.',
    useCaseText:
      'Providing active weight magnitude, weight distribution, shape cues in virtual reality interactions.',
    useCaseTags: ['Weight magnitude cues', 'Weight distribution cues', 'Shape cues'],
    generalUseCases: ['Gaming', 'Training'],
    submodalities: ['Weight magnitude', 'Weight distribution', 'Shape'],
    media: [
      {
        type: 'image',
        src: 'img/shifty.jpg',
      },
      {
        type: 'image',
        src: 'img/shifty_hand.jpg',
      },
      {
        type: 'video',
        src: 'https://www.youtube.com/watch?v=1l0wKk6q_ss',
      },
    ],
    doi: '10.1109/TVCG.2017.2656978',
    publication: 'IEEE TVCG / IEEE VR',
    year: '2017',
    audit: {
      score: 3,
      ticks_str: '3',
      sensations: ['Weight magnitude', 'Weight distribution', 'Shape'],
      status: 'auditable',
    },
  },
  {
    name: 'SWISH',
    category: 'Solid mass shifting',
    author: 'Shahabedin Sagheb, Frank Wencheng Liu, Alireza Bahremand, Assegid Kidane, Robert LiKamWa',
    title:
      'SWISH: A Shifting-Weight Interface of Simulated Hydrodynamics for Haptic Perception of Virtual Fluid Vessels',
    mechanism: 'Motors relocate the centre of gravity to emulate liquid sloshing inside a handheld vessel.',
    useCaseText:
      'Simulating realistic liquid sloshing, pouring, and viscosity within handheld bottles and cups in VR/MR.',
    useCaseTags: ['Weight distribution cues', 'Shape cues'],
    generalUseCases: ['Virtual bartending', 'Gaming', 'Physics simulation'],
    submodalities: ['Weight distribution', 'Shape'],
    media: [
      {
        type: 'image',
        src: 'img/swish.jpg',
      },
      {
        type: 'image',
        src: 'img/swish_mechanism.jpg',
      },
      {
        type: 'video',
        src: 'https://www.youtube.com/watch?v=29Vj3UMnp6o',
      },
    ],
    doi: '10.1145/3332165.3347870',
    publication: 'ACM UIST',
    year: '2019',
    audit: {
      score: 2,
      ticks_str: '2',
      sensations: ['Weight distribution', 'Shape'],
      status: 'updated',
    },
  },
  {
    name: 'Transcalibur',
    category: 'Solid mass shifting',
    author:
      'Jotaro Shigeyama, Takeru Hashimoto, Shigeo Yoshida, Takuji Narumi, Tomohiro Tanikawa, Michitaka Hirose',
    title:
      'Transcalibur: A Weight Shifting Virtual Reality Controller for 2D Shape Rendering based on Computational Perception Model',
    mechanism: 'A 2-DoF weight shift reconfigures mass distribution, rendering 2D shapes via a perception model.',
    useCaseText:
      'Simulating the apparent shape, length, and inertia of diverse virtual handheld objects (swords, shields, wands) in VR.',
    useCaseTags: ['Weight distribution cues', 'Shape cues'],
    generalUseCases: ['Gaming', 'Virtual sports', 'Weapon simulation'],
    submodalities: ['Weight distribution', 'Shape'],
    media: [
      {
        type: 'image',
        src: 'img/transcalibur.jpg',
      },
      {
        type: 'image',
        src: 'img/transcalibur_mechanism.jpg',
      },
      {
        type: 'video',
        src: 'https://www.youtube.com/watch?v=OiSbn6D5kwA',
      },
    ],
    doi: '10.1145/3290605.3300241',
    publication: 'ACM CHI',
    year: '2019',
    audit: {
      score: 2,
      ticks_str: '2',
      sensations: ['Weight distribution', 'Shape'],
      status: 'auditable',
    },
  },
  {
    name: 'Unident',
    category: 'Solid mass shifting',
    author: 'Shuntaro Shimizu et al.',
    title:
      'Unident: Providing Impact Sensations on Handheld Objects via High-Speed Change of the Rotational Inertia',
    mechanism: 'A belt drives a weight along the grip, giving directional impact and the size of the held object.',
    useCaseText:
      'Providing realistic ungrounded impact sensations and virtual object length/inertia perception in handheld VR tasks.',
    useCaseTags: ['Impact cues', 'Shape cues'],
    generalUseCases: ['Gaming', 'Training'],
    submodalities: ['Impact', 'Shape'],
    media: [
      {
        type: 'image',
        src: 'img/unident_hand.jpg',
      },
      {
        type: 'image',
        src: 'img/unident.png',
      },
      {
        type: 'video',
        src: 'https://www.youtube.com/watch?v=bNRKsab2y6c',
      },
    ],
    doi: '10.1109/VR50410.2021.00021',
    publication: 'IEEE VR',
    year: '2021',
    audit: {
      score: 2,
      ticks_str: '2',
      sensations: ['Impact', 'Shape'],
      status: 'updated',
    },
  },
  {
    name: 'VolRec',
    category: 'Solid mass shifting',
    author: 'Ryota Koshiyama et al.',
    title: 'VolRec: Haptic display of virtual inner volume in consideration of angular moment',
    mechanism: "A motor raises the grasped object's centre of gravity to convey the volume enclosed inside it.",
    useCaseText:
      'Displaying perceived inner volume and liquid filling levels of virtual handheld containers.',
    useCaseTags: ['Weight distribution cues', 'Shape cues'],
    generalUseCases: ['Gaming', 'Training'],
    submodalities: ['Weight distribution', 'Shape'],
    media: [
      {
        type: 'image',
        src: 'img/volrec.png',
      },
      {
        type: 'image',
        src: 'img/volrec_fig.png',
      },
    ],
    doi: '10.1145/2832932.2832970',
    publication: 'ACM ACE',
    year: '2015',
    audit: {
      score: 2,
      ticks_str: '2',
      sensations: ['Weight distribution', 'Shape'],
      status: 'added',
    },
  },
  {
    name: 'White et al.',
    category: 'Solid mass shifting',
    author: 'Michael White et al.',
    title: 'The Case for Haptic Props: Shape, Weight and Vibro-tactile Feedback',
    mechanism: 'Weighted physical props are compared against vibrotactile feedback for shape and weight realism.',
    useCaseText:
      'Evaluating empirical impact of mass distribution, weight realism, and physical grip stance in VR sports and tool simulations.',
    useCaseTags: ['Weight magnitude cues'],
    generalUseCases: ['Gaming', 'Training'],
    submodalities: ['Weight magnitude'],
    media: [
      {
        type: 'image',
        src: 'img/white.jpg',
      },
      {
        type: 'image',
        src: 'img/white_props.jpg',
      },
    ],
    doi: '10.1145/3359566.3360060',
    publication: 'ACM MIG',
    year: '2019',
    audit: {
      score: 1,
      ticks_str: '1',
      sensations: ['Weight magnitude'],
      status: 'pending',
    },
  },
  {
    name: 'GamesBond',
    category: 'Grip morphing',
    author: 'Neung Ryu et al.',
    title:
      'GamesBond: Bimanual Haptic Illusion of Physically Connected Objects for Immersive VR Using Grip Deformation',
    mechanism: 'Paired controllers deform their grips in sync, so the hands feel one connected object between them.',
    useCaseText:
      'Rendering bimanual sensations of connected virtual props such as jumping ropes, bows, and elastic bands in VR.',
    useCaseTags: ['Shape cues'],
    generalUseCases: ['Gaming', 'Training'],
    submodalities: ['Shape'],
    media: [
      {
        type: 'image',
        src: 'img/gamesbond.jpg',
      },
      {
        type: 'image',
        src: 'img/gamesbond_mechanism.jpg',
      },
      {
        type: 'video',
        src: 'https://www.youtube.com/watch?v=0f3wAVNglsk',
      },
    ],
    doi: '10.1145/3411764.3445727',
    publication: 'ACM CHI',
    year: '2021',
    audit: {
      score: 1,
      ticks_str: '1',
      sensations: ['Shape'],
      status: 'auditable',
    },
  },
  {
    name: 'Mac Murray et al.',
    category: 'Grip morphing',
    author: 'Benjamin C. Mac Murray et al.',
    title: 'A variable shape and variable stiffness controller for haptic virtual interactions',
    mechanism: 'A pneumatic chamber in the grip inflates and deflates, varying how firm the held object feels.',
    useCaseText:
      'Providing active stiffness and shape feedback for grasping rigid vs. soft compliant virtual items.',
    useCaseTags: ['Stiffness cues', 'Shape cues'],
    generalUseCases: ['Gaming', 'Training'],
    submodalities: ['Stiffness', 'Shape'],
    media: [
      {
        type: 'image',
        src: 'img/murray.jpg',
      },
      {
        type: 'image',
        src: 'img/murray_mechanism.jpg',
      },
    ],
    doi: '10.1109/ROBOSOFT.2018.8404930',
    publication: 'IEEE RoboSoft',
    year: '2018',
    audit: {
      score: 2,
      ticks_str: '2',
      sensations: ['Stiffness', 'Shape'],
      status: 'corrected',
    },
  },
  {
    name: 'PaCaPa',
    category: 'Grip morphing',
    author: 'Yuqian Sun et al.',
    title:
      'PaCaPa: A Handheld Haptic Device for Rendering Size, Shape, and Stiffness of Virtual Tools in Virtual Reality',
    mechanism: 'Two motorised wings open against palm and fingers, rendering the size, shape and stiffness of tools.',
    useCaseText:
      'Simulating the size, contour, and impact stiffness of virtual tools like sticks, swords, and rackets in VR.',
    useCaseTags: ['Stiffness cues', 'Shape cues'],
    generalUseCases: ['Gaming', 'Training'],
    submodalities: ['Stiffness', 'Shape'],
    media: [
      {
        type: 'image',
        src: 'img/pacapa.jpg',
      },
      {
        type: 'image',
        src: 'img/pacapa_mechanism.jpg',
      },
      {
        type: 'video',
        src: 'https://www.youtube.com/watch?v=STvdd5JP0HA',
      },
    ],
    doi: '10.1145/3290605.3300682',
    publication: 'ACM CHI',
    year: '2019',
    audit: {
      score: 2,
      ticks_str: '2',
      sensations: ['Stiffness', 'Shape'],
      status: 'auditable',
    },
  },
  {
    name: 'Shape-A-Getti',
    category: 'Grip morphing',
    author: 'Filipe Barbosa et al.',
    title: 'Shape-A-Getti: A haptic device for getting multiple shapes using a simple actuator',
    mechanism: 'One actuator rotates radial poles into different profiles, so a single motor renders many shapes.',
    useCaseText:
      'Rendering polymorphic shape profiles and thickness changes for grasping virtual handles, flashlights, and cylinders.',
    useCaseTags: ['Shape cues'],
    generalUseCases: ['Gaming', 'Training'],
    submodalities: ['Shape'],
    media: [
      {
        type: 'image',
        src: 'img/shapeagetti.jpg',
      },
      {
        type: 'image',
        src: 'img/shapeagetti_mechanism.jpg',
      },
    ],
    doi: '10.1016/j.cag.2023.10.014',
    publication: 'Computers & Graphics',
    year: '2023',
    audit: {
      score: 1,
      ticks_str: '1',
      sensations: ['Shape'],
      status: 'auditable',
    },
  },
  {
    name: 'ThumbShift',
    category: 'Grip morphing',
    author: 'Jian Zhang et al.',
    title: 'ThumbShift: Modulating Perceived Object Properties Through Dynamic Thumb Repositioning',
    mechanism: 'A motor and servo reposition the thumb rest, changing perceived object size and heaviness.',
    useCaseText:
      'Modulating perceived heaviness, heft, and scale of handheld objects in virtual reality without large force-feedback motors.',
    useCaseTags: ['Weight magnitude cues', 'Shape cues'],
    generalUseCases: ['Gaming', 'Training'],
    submodalities: ['Weight magnitude', 'Shape'],
    media: [
      {
        type: 'image',
        src: 'img/thumbshift.jpg',
      },
      {
        type: 'image',
        src: 'img/thumbshift_mechanism.jpg',
      },
    ],
    doi: '10.1109/ISMAR67309.2025.00067',
    publication: 'IEEE ISMAR',
    year: '2025',
    audit: {
      score: 2,
      ticks_str: '2',
      sensations: ['Weight magnitude', 'Shape'],
      status: 'auditable',
    },
  },
  {
    name: 'X-Rings',
    category: 'Grip morphing',
    author: 'Eric J. Gonzalez et al.',
    title: 'X-Rings: A Hand-Mounted 360° Shape Display for Grasping in Virtual Reality',
    mechanism: 'Concentric rings rise and fall around the hand, forming 360 degree grip shapes for grasping.',
    useCaseText:
      'Rendering dynamic 360-degree contours, grasping affordances, and squeezing stiffness for handles, goblets, and spheres.',
    useCaseTags: ['Shape cues'],
    generalUseCases: ['Gaming', 'Training'],
    submodalities: ['Shape'],
    media: [
      {
        type: 'image',
        src: 'img/xrings.jpg',
      },
      {
        type: 'image',
        src: 'img/xrings_mechanism.jpg',
      },
      {
        type: 'video',
        src: 'https://www.youtube.com/watch?v=yTqaB1g-IeY',
      },
    ],
    doi: '10.1145/3472749.3474782',
    publication: 'ACM UIST',
    year: '2021',
    audit: {
      score: 1,
      ticks_str: '1',
      sensations: ['Shape'],
      status: 'auditable',
    },
  },
  {
    name: 'ShakeSense',
    category: 'Electrode stimulation',
    author: 'Zhenxuan He et al.',
    title: 'ShakeSense: An Electrotactile System to Simulate Shaking a Container with Fluid Contents',
    mechanism: 'Two 64-electrode arrays on the cup walls stimulate thumb and index to simulate sloshing contents.',
    useCaseText:
      'Simulating dynamic liquid splashing, sloshing waves, and fluid viscosity inside handheld virtual containers.',
    useCaseTags: ['Friction cues'],
    generalUseCases: ['Gaming', 'Training'],
    submodalities: ['Friction'],
    media: [
      {
        type: 'image',
        src: 'img/shakesense.jpg',
      },
      {
        type: 'image',
        src: 'img/shakesense_mechanism.jpg',
      },
    ],
    doi: '10.1145/3772318.3791974',
    publication: 'ACM CHI',
    year: '2026',
    audit: {
      score: 1,
      ticks_str: '1',
      sensations: ['Friction'],
      status: 'auditable',
    },
  },
  {
    name: 'Slip-Grip',
    category: 'Electrode stimulation',
    author: 'Hongnan Lin et al.',
    title: 'Slip-Grip: An Electrotactile Method to Simulate Weight',
    mechanism: 'Electrotactile stimulation fakes fingertip slip, so the user grips harder and reads it as weight.',
    useCaseText:
      'Rendering weight perception and slip transitions on handheld virtual objects without bulky mechanical actuators.',
    useCaseTags: ['Friction cues', 'Weight magnitude cues'],
    generalUseCases: ['Gaming', 'Training'],
    submodalities: ['Friction', 'Weight magnitude'],
    media: [
      {
        type: 'image',
        src: 'img/slipgrip.jpg',
      },
      {
        type: 'image',
        src: 'img/slipgrip_mechanism.jpg',
      },
    ],
    doi: '10.1145/3706598.3713361',
    publication: 'ACM CHI',
    year: '2025',
    audit: {
      score: 2,
      ticks_str: '2',
      sensations: ['Friction', 'Weight magnitude'],
      status: 'auditable',
    },
  },
  {
    name: 'Mouillé',
    category: 'Peltier cell actuation',
    author: 'Teng Han et al.',
    title: 'Mouillé: Exploring Wetness Illusion on Fingertips to Enhance Immersive Experience in VR',
    mechanism: 'Rapid cooling at the fingertips evokes an illusion of wetness during virtual contact with liquids.',
    useCaseText:
      'Rendering tactile wetness illusions and temperature sensations during virtual water and fluid interactions.',
    useCaseTags: ['Thermal cues'],
    generalUseCases: ['Gaming', 'Training'],
    submodalities: ['Thermal'],
    media: [
      {
        type: 'image',
        src: 'img/mouille.jpg',
      },
      {
        type: 'image',
        src: 'img/mouille_mechanism.jpg',
      },
      {
        type: 'video',
        src: 'https://www.youtube.com/watch?v=WUZGRM8f9TU',
      },
    ],
    doi: '10.1145/3313831.3376138',
    publication: 'ACM CHI',
    year: '2020',
    audit: {
      score: 1,
      ticks_str: '1',
      sensations: ['Thermal'],
      status: 'pending',
    },
  },
  {
    name: 'ThermalPen',
    category: 'Peltier cell actuation',
    author: 'Philipp Pascal Hoffmann et al.',
    title:
      'ThermalPen: Investigating the Influence of Thermal Haptic Feedback for Creativity in 3D Sketching',
    mechanism: 'A Peltier cell in the barrel maps the colour and texture of each 3D sketch stroke to temperature.',
    useCaseText:
      'Augmenting 3D sketching, creative modeling, and material rendering with temperature cues in VR.',
    useCaseTags: ['Thermal cues'],
    generalUseCases: ['Gaming', 'Training'],
    submodalities: ['Thermal'],
    media: [
      {
        type: 'image',
        src: 'img/thermalpen.jpg',
      },
      {
        type: 'image',
        src: 'img/thermalpen_mechanism.jpg',
      },
      {
        type: 'video',
        src: 'https://www.youtube.com/watch?v=plEx_9fr7Zc',
      },
    ],
    doi: '10.1145/3635636.3656191',
    publication: 'ACM C&C',
    year: '2024',
    audit: {
      score: 1,
      ticks_str: '1',
      sensations: ['Thermal'],
      status: 'auditable',
    },
  },
  {
    name: 'Aero-plane',
    category: 'Propeller thrust',
    author: 'Seungwoo Je et al.',
    title:
      'Aero-plane: A Handheld Force-Feedback Device that Renders Weight Motion Illusion on a Virtual 2D Plane',
    mechanism: 'Two propellers push along the board, so a virtual mass seems to roll across a 2D plane.',
    useCaseText:
      'Rendering dynamic weight shifting, inertia, and sliding sensations across 2D planar props like trays and kitchen tools in VR.',
    useCaseTags: ['Motion cues', 'Weight distribution cues', 'Shape cues'],
    generalUseCases: ['Gaming', 'Training'],
    submodalities: ['Motion', 'Weight distribution', 'Shape'],
    media: [
      {
        type: 'image',
        src: 'img/aeroplane.jpg',
      },
      {
        type: 'image',
        src: 'img/aeroplane_mechanism.jpg',
      },
      {
        type: 'video',
        src: 'https://www.youtube.com/watch?v=-8yYRvdDKPM',
      },
    ],
    doi: '10.1145/3332165.3347926',
    publication: 'ACM UIST',
    year: '2019',
    audit: {
      score: 3,
      ticks_str: '3',
      sensations: ['Motion', 'Weight distribution', 'Shape'],
      status: 'pending',
    },
  },
  {
    name: 'Arezoo et al.',
    category: 'Propeller thrust',
    author: 'Keyvan Arezoo et al.',
    title: 'A Novel Ungrounded Haptic Device for Generation and Orientation of Force and Torque Feedbacks',
    mechanism: 'A gimbal orients propeller-generated force and torque in any direction around the handle.',
    useCaseText:
      'Delivering simultaneous multi-axis force vectors and rotational torque cues for ungrounded tools and steering in VR.',
    useCaseTags: ['Motion cues', 'Resistance cues'],
    generalUseCases: ['Gaming', 'Training'],
    submodalities: ['Motion', 'Resistance'],
    media: [
      {
        type: 'image',
        src: 'img/arezoo.jpg',
      },
      {
        type: 'image',
        src: 'img/arezoo_mechanism.jpg',
      },
    ],
    doi: '10.1109/TOH.2024.3493377',
    publication: 'IEEE ToH',
    year: '2024',
    audit: {
      score: 2,
      ticks_str: '2',
      sensations: ['Motion', 'Resistance'],
      status: 'auditable',
    },
  },
  {
    name: 'CrazyJoystick',
    category: 'Propeller thrust',
    author: 'Yang Chen, Xinlei Yu, and Heather Culbertson',
    title:
      'CrazyJoystick: A Handheld Flyable Joystick for Providing On-Demand Haptic Feedback in Extended Reality',
    mechanism: 'A quadrotor flies to the user, then reallocates its thrust as handheld torque and force.',
    useCaseText:
      'Providing on-demand flyable joystick interaction and active directional resistance in spatial VR navigation.',
    useCaseTags: ['Motion cues', 'Resistance cues'],
    generalUseCases: ['Gaming', 'Training'],
    submodalities: ['Motion', 'Resistance'],
    media: [
      {
        type: 'image',
        src: 'img/crazyjoystick.jpg',
      },
      {
        type: 'image',
        src: 'img/crazyjoystick_mechanism.jpg',
      },
      {
        type: 'video',
        src: 'https://www.youtube.com/watch?v=8QuRP5O5Vi8',
      },
    ],
    doi: '10.1109/WHC64065.2025.11123327',
    publication: 'IEEE WHC',
    year: '2025',
    audit: {
      score: 2,
      ticks_str: '2',
      sensations: ['Motion', 'Resistance'],
      status: 'updated',
    },
  },
  {
    name: 'Flyables',
    category: 'Propeller thrust',
    author: 'Jonas Auda et al.',
    title: 'Flyables: Haptic Input Devices for Virtual Reality using Quadcopters',
    mechanism: 'A quadcopter delivers a matching 3D-printed prop on demand, so each UI element has its own form.',
    useCaseText:
      'Supplying physical prop counterparts and tangible shapes on demand for diverse UI widgets in VR.',
    useCaseTags: ['Shape cues'],
    generalUseCases: ['Gaming', 'Training'],
    submodalities: ['Shape'],
    media: [
      {
        type: 'image',
        src: 'img/flyables.jpg',
      },
      {
        type: 'image',
        src: 'img/flyables_mechanism.jpg',
      },
      {
        type: 'video',
        src: 'https://www.youtube.com/watch?v=kAw3gDq_2wM',
      },
    ],
    doi: '10.1145/3489849.3489855',
    publication: 'ACM VRST',
    year: '2021',
    audit: {
      score: 1,
      ticks_str: '1',
      sensations: ['Shape'],
      status: 're-check',
    },
  },
  {
    name: 'Hydra',
    category: 'Propeller thrust',
    author: 'Christian Eichhorn et al.',
    title:
      'Hydra – A Hybrid Controller for Multi-Haptic Feedback to Mimic Impulsive Forces in Virtual Reality',
    mechanism: 'A solenoid fires a 90 g projectile for 26 N impacts while four propellers push the hand.',
    useCaseText:
      'Simulating sharp impulsive collisions, weapon discharges, and sustained aerodynamic drag in VR combat and tool simulations.',
    useCaseTags: ['Impact cues', 'Motion cues'],
    generalUseCases: ['Gaming', 'Training'],
    submodalities: ['Impact', 'Motion'],
    media: [
      {
        type: 'image',
        src: 'img/hydra.jpg',
      },
      {
        type: 'image',
        src: 'img/hydra_mechanism.jpg',
      },
    ],
    doi: '10.1109/VRW70859.2026.00237',
    publication: 'IEEE VRW',
    year: '2026',
    audit: {
      score: 2,
      ticks_str: '2',
      sensations: ['Impact', 'Motion'],
      status: 'auditable',
    },
  },
  {
    name: 'LevioPole',
    category: 'Propeller thrust',
    author: 'Tomoya Sasaki et al.',
    title: 'LevioPole: Mid-Air Haptic Interactions Using Multirotor',
    mechanism: 'Multirotors at both ends of a two-handed pole push against the air for mid-air resistance.',
    useCaseText:
      'Simulating bimanual mid-air sports resistance, kayaking, and heavy virtual pole balancing in VR.',
    useCaseTags: ['Resistance cues'],
    generalUseCases: ['Gaming', 'Training'],
    submodalities: ['Resistance'],
    media: [
      {
        type: 'image',
        src: 'img/leviopole.jpg',
      },
      {
        type: 'image',
        src: 'img/leviopole_mechanism.jpg',
      },
      {
        type: 'video',
        src: 'https://www.youtube.com/watch?v=Qh3SDRaOR_4',
      },
    ],
    doi: '10.1145/3214907.3214913',
    publication: 'ACM SIGGRAPH',
    year: '2018',
    audit: {
      score: 1,
      ticks_str: '1',
      sensations: ['Resistance'],
      status: 'pending',
    },
  },
  {
    name: "Thor's Hammer",
    category: 'Propeller thrust',
    author: 'Seongkook Heo et al.',
    title: "Thor's Hammer: An Ungrounded Force Feedback Device Utilizing Propeller-Induced Propulsive Force",
    mechanism: 'Six propellers combine into a 3-DoF ungrounded force vector, rendering weight, stiffness and motion.',
    useCaseText:
      'Rendering 3D ungrounded force vectors, weight, spring stiffness, and directional wind drag in VR.',
    useCaseTags: ['Stiffness cues', 'Motion cues', 'Resistance cues', 'Weight magnitude cues'],
    generalUseCases: ['Gaming', 'Training'],
    submodalities: ['Stiffness', 'Motion', 'Resistance', 'Weight magnitude'],
    media: [
      {
        type: 'image',
        src: 'img/thorshammer.jpg',
      },
      {
        type: 'image',
        src: 'img/thorshammer_mechanism.jpg',
      },
      {
        type: 'video',
        src: 'https://www.youtube.com/watch?v=wE-nkHiqTyU',
      },
    ],
    doi: '10.1145/3173574.3174099',
    publication: 'ACM CHI',
    year: '2018',
    audit: {
      score: 4,
      ticks_str: '4',
      sensations: ['Stiffness', 'Motion', 'Resistance', 'Weight magnitude'],
      status: 'priority',
    },
  },
  {
    name: 'OrbitStick',
    category: 'Mass acceleration',
    author: 'Jaesuk Jang, Seokmin Hong, Jaeyoung Park',
    title: 'OrbitStick: A Hand-Held Haptic Impact Display With Mass Shifting Mechanism',
    mechanism: 'A spherical mass runs on an invisible hemisphere and abruptly changes direction to render impact.',
    useCaseText:
      'Rendering multi-directional ungrounded impact forces, collisions, and recoil sensations in VR.',
    useCaseTags: ['Impact cues', 'Motion cues'],
    generalUseCases: ['Gaming', 'Virtual sports', 'Collision simulation'],
    submodalities: ['Impact'],
    media: [
      {
        type: 'image',
        src: 'img/orbitstick.jpg',
      },
      {
        type: 'image',
        src: 'img/orbitstick_mechanism.jpg',
      },
    ],
    doi: '10.1109/access.2026.3690302',
    publication: 'IEEE Access',
    year: '2026',
    audit: {
      score: 1,
      ticks_str: '1',
      sensations: ['Impact'],
      status: 'auditable',
    },
  },
  {
    name: 'Su et al.',
    category: 'Mass acceleration',
    author: 'Yuning Su, Weizhi Nai, Xiaoying Sun, Zuowei Sun',
    title: 'Design and Modeling of an Ungrounded Haptic Gun that Simulates Recoil Using Asymmetric Force',
    mechanism: 'A voice coil drives asymmetric force in a gun-shaped controller, rendering recoil rather than buzz.',
    useCaseText: 'Simulating realistic ungrounded firearm recoil sensations in VR shooting simulations.',
    useCaseTags: ['Impact cues'],
    generalUseCases: ['Gaming', 'Shooting simulation', 'Tactical training'],
    submodalities: ['Impact'],
    media: [
      {
        type: 'image',
        src: 'img/su.jpg',
      },
      {
        type: 'image',
        src: 'img/su_mechanism.jpg',
      },
    ],
    doi: '10.1109/whc49131.2021.9517202',
    publication: 'IEEE World Haptics (WHC)',
    year: '2021',
    audit: {
      score: 1,
      ticks_str: '1',
      sensations: ['Impact'],
      status: 'auditable',
    },
  },
  {
    name: 'Amemiya et al.',
    category: 'Mass acceleration',
    author: 'Tomohiro Amemiya and Taro Maeda',
    title: 'Asymmetric Oscillation Distorts the Perceived Heaviness of Handheld Objects',
    mechanism: 'Asymmetric oscillation of an internal mass distorts how heavy the handheld object feels.',
    useCaseText:
      'Distorting perceived heaviness and inducing weight illusions on handheld controllers without external grounding.',
    useCaseTags: ['Weight magnitude cues'],
    generalUseCases: ['Gaming', 'Training'],
    submodalities: ['Weight magnitude'],
    media: [
      {
        type: 'image',
        src: 'img/amemiya.jpg',
      },
      {
        type: 'image',
        src: 'img/amemiya_mechanism.jpg',
      },
    ],
    doi: '10.1109/TOH.2008.5',
    publication: 'IEEE ToH',
    year: '2008',
    audit: {
      score: 1,
      ticks_str: '1',
      sensations: ['Weight magnitude'],
      status: 'pending',
    },
  },
  {
    name: 'HapReel',
    category: 'Surface rotation',
    author: 'Daichi Inoue, Kazuki Nishimoto, Takuto Nakamura, Koki Fukuda, Takuji Narumi',
    title:
      'HapReel: A Racket-shaped Haptic Display Controller for Presenting Vibrotactile and Force Feedback through Fingertip Deformation',
    mechanism: 'Two motors deform the fingertip on a racket-shaped body for vibrotactile and impact feedback.',
    useCaseText:
      'Rendering continuous surface sliding, friction resistance, and fingertip tactile shear during virtual sports.',
    useCaseTags: ['Friction cues', 'Fingertip shear', 'Tape reel deformation'],
    generalUseCases: ['Gaming', 'Training'],
    submodalities: ['Vibration', 'Impact'],
    media: [
      {
        type: 'image',
        src: 'img/hapreel.png',
      },
      {
        type: 'image',
        src: 'img/hapreel_mechanism.png',
      },
    ],
    doi: '10.1145/3610541.3614583',
    publication: 'ACM SIGGRAPH Asia E-Tech',
    year: '2023',
    audit: {
      score: 2,
      ticks_str: '2',
      sensations: ['Vibration', 'Impact'],
      status: 'updated',
    },
  },
  {
    name: 'Haptic Palette',
    category: 'Surface rotation',
    author: 'Donald Degraen, Anna Reindl, Akhmajon Makhsadov, André Zenner, Antonio Krüger',
    title: 'Envisioning Haptic Design for Immersive Virtual Environments',
    mechanism: 'A rotating disc brings physical texture samples under the finger during virtual surface exploration.',
    useCaseText:
      'Tactile surface exploration, texture switching, and material inspection in immersive virtual environments.',
    useCaseTags: ['Friction cues', 'Texture rendering', 'Rotating texture disc'],
    generalUseCases: ['Gaming', 'Training'],
    submodalities: ['Friction'],
    media: [
      {
        type: 'image',
        src: 'img/hapticpalette.jpg',
      },
      {
        type: 'image',
        src: 'img/hapticpalette_mechanism.png',
      },
    ],
    doi: '10.1145/3393914.3395870',
    publication: 'ACM DIS Companion',
    year: '2020',
    audit: {
      score: 1,
      ticks_str: '1',
      sensations: ['Friction'],
      status: 'pending',
    },
  },
  {
    name: 'Haptic Revolver',
    category: 'Surface rotation',
    author: 'Eric Whitmire, Hrvoje Benko, Christian Holz, Eyal Ofek, Mike Sinclair',
    title: 'Haptic Revolver: Touch, Shear, Texture, and Shape Display for Virtual Reality',
    mechanism: 'An interchangeable wheel raises and spins under the fingertip for touch, shear, texture and shape.',
    useCaseText:
      'Rendering fingertip contact, surface shear friction, and tangible contours during virtual object touching.',
    useCaseTags: ['Friction cues', 'Shape cues', 'Surface shear'],
    generalUseCases: ['Gaming', 'Training'],
    submodalities: ['Friction', 'Shape'],
    media: [
      {
        type: 'image',
        src: 'img/hapticrevolver.png',
      },
      {
        type: 'image',
        src: 'img/hapticrevolver_mechanism.png',
      },
    ],
    doi: '10.1145/3173574.3173660',
    publication: 'ACM CHI',
    year: '2018',
    audit: {
      score: 2,
      ticks_str: '2',
      sensations: ['Friction', 'Shape'],
      status: 'auditable',
    },
  },
  {
    name: 'Liu et al. (2025)',
    category: 'Surface rotation',
    author:
      'Yuhu Liu, Makoto Wakabayashi, Tomokazu Kake, Masaomi Nishidate, Yusuke Watanabe, Osamu Ito, Yusuke Nakagawa, Hideki Mori',
    title: 'Handheld Shear Force Feedback Controller with Double Roller Modules: A Demonstration',
    mechanism: 'Twin unlimited-rotation rollers render shear force and low-frequency vibration against the palm.',
    useCaseText:
      'Simulating continuous traction, slip friction, and directional shear drag during virtual tool manipulation.',
    useCaseTags: ['Friction cues', 'Dual rollers', 'Palm shear force'],
    generalUseCases: ['Gaming', 'Training'],
    submodalities: ['Friction', 'Vibration', 'Resistance'],
    media: [
      {
        type: 'image',
        src: 'img/liu2025.png',
      },
      {
        type: 'image',
        src: 'img/liu2025_mechanism.jpg',
      },
    ],
    doi: '10.1145/3746058.3758990',
    publication: 'ACM UIST Adjunct',
    year: '2025',
    audit: {
      score: 3,
      ticks_str: '3',
      sensations: ['Friction', 'Vibration', 'Resistance'],
      status: 'auditable',
    },
  },
  {
    name: 'MacLean et al.',
    category: 'Surface rotation',
    author: 'Karon E. MacLean, Michael J. Shaver, Dinesh K. Pai',
    title: 'Handheld Haptics: A USB Media Controller with Force Sensing',
    mechanism: 'A motorised thumbwheel renders texture and detents as the thumb actively explores a surface.',
    useCaseText:
      'Navigating virtual timelines, media browsing, and rate-controlled scrolling with active haptic resistance.',
    useCaseTags: ['Friction cues', 'Thumbwheel', 'Force sensing'],
    generalUseCases: ['Gaming', 'Training'],
    submodalities: ['Friction'],
    media: [
      {
        type: 'image',
        src: 'img/maclean.png',
      },
      {
        type: 'image',
        src: 'img/maclean_mechanism.png',
      },
    ],
    doi: '10.1109/HAPTIC.2002.998974',
    publication: 'IEEE HAPTICS',
    year: '2002',
    audit: {
      score: 1,
      ticks_str: '1',
      sensations: ['Friction'],
      status: 'pending',
    },
  },
  {
    name: 'MateREAL',
    category: 'Surface rotation',
    author: 'Katsuya Maezono, Hikaru Nagano, Masashi Konyo',
    title: 'MateREAL Touch: Handheld Haptic Texture Display with Active Rollers',
    mechanism: 'A tape of up to 30 real material samples rolls under the finger, moving in sync with its motion.',
    useCaseText:
      'Realistic tactile material exploration, surface stroking, and fine texture rendering in virtual shopping and design.',
    useCaseTags: ['Friction cues', 'Active rollers', 'Texture rendering'],
    generalUseCases: ['Gaming', 'Training'],
    submodalities: ['Friction'],
    media: [
      {
        type: 'image',
        src: 'img/matereal.png',
      },
      {
        type: 'image',
        src: 'img/matereal_mechanism.jpg',
      },
    ],
    doi: '10.3390/electronics14071250',
    publication: 'Electronics',
    year: '2025',
    audit: {
      score: 1,
      ticks_str: '1',
      sensations: ['Friction'],
      status: 'auditable',
    },
  },
  {
    name: 'RollingStone',
    category: 'Surface rotation',
    author: 'Jo-Yu Lo, Da-Yuan Huang, Chien-Chieh Sun, Bing-Yu Chen',
    title: 'RollingStone: Using Single Slip Taxel for Enhancing Surface Texture Rendering',
    mechanism: 'A pair of motors spins a ball under the fingertip, rendering 2-DoF slip and surface texture.',
    useCaseText:
      'Enhancing virtual surface inspection, 3D contour tracing, and fine fabric texture exploration in VR.',
    useCaseTags: ['Friction cues', 'Omnidirectional slip', 'Fingertip taxel'],
    generalUseCases: ['Gaming', 'Training'],
    submodalities: ['Friction'],
    media: [
      {
        type: 'image',
        src: 'img/rollingstone.png',
      },
      {
        type: 'image',
        src: 'img/rollingstone_mechanism.png',
      },
    ],
    doi: '10.1145/3242587.3242627',
    publication: 'ACM UIST',
    year: '2018',
    audit: {
      score: 1,
      ticks_str: '1',
      sensations: ['Friction'],
      status: 'auditable',
    },
  },
  {
    name: 'SpinOcchio',
    category: 'Surface rotation',
    author: 'Myung Jin Kim, Neung Ryu, Jinwook Chang, Andrea Bianchi',
    title: 'SpinOcchio: Understanding Haptic-Visual Congruency for Surface Exploration in VR',
    mechanism: 'Spinning discs deliver skin-slip to two opposing fingertips as the grip tightens or lets go.',
    useCaseText:
      'Providing realistic slippage, rotational friction, and dynamic skin shear during virtual surface touching.',
    useCaseTags: ['Friction cues', 'Counter-rotating rings', 'Skin stretch'],
    generalUseCases: ['Gaming', 'Training'],
    submodalities: ['Friction'],
    media: [
      {
        type: 'image',
        src: 'img/spinocchio.png',
      },
      {
        type: 'image',
        src: 'img/spinocchio_mechanism.png',
      },
    ],
    doi: '10.1145/3491102.3517724',
    publication: 'ACM CHI',
    year: '2022',
    audit: {
      score: 1,
      ticks_str: '1',
      sensations: ['Friction'],
      status: 'auditable',
    },
  },
  {
    name: 'Chasm',
    category: 'Plate shearing',
    author: 'Pornthep Preechayasomboon, Ali Israr, Eric Whitmire',
    title: 'Chasm: A Screw Based Expressive Compact Haptic Actuator',
    mechanism: 'A miniature leadscrew drives a nut carriage that stretches the skin and vibrates it in one unit.',
    useCaseText:
      'Presenting combined normal pressure, tangential skin stretch, and surface friction during tactile exploration.',
    useCaseTags: ['Friction cues', 'Leadscrew shear', 'Tangential stretch'],
    generalUseCases: ['Gaming', 'Training'],
    submodalities: ['Friction', 'Vibration'],
    media: [
      {
        type: 'image',
        src: 'img/chasm.png',
      },
      {
        type: 'image',
        src: 'img/chasm_mechanism.png',
      },
    ],
    doi: '10.1145/3313831.3376512',
    publication: 'ACM CHI',
    year: '2020',
    audit: {
      score: 2,
      ticks_str: '2',
      sensations: ['Friction', 'Vibration'],
      status: 'updated',
    },
  },
  {
    name: 'Kurita et al.',
    category: 'Plate shearing',
    author: 'Yuichi Kurita, Satoshi Yonezawa, Atsutoshi Ikeda, Tsukasa Ogasawara',
    title: 'Weight and Friction Display Device by Controlling the Slip Condition of a Fingertip',
    mechanism: 'Plates control the slip condition at the fingertip, producing weight and friction illusions.',
    useCaseText:
      'Simulating virtual object weight and surface friction via fingertip slip ratio manipulation.',
    useCaseTags: ['Friction cues', 'Fingertip slip', 'Shear plate'],
    generalUseCases: ['Gaming', 'Training'],
    submodalities: ['Friction', 'Weight magnitude'],
    media: [
      {
        type: 'image',
        src: 'img/kurita.png',
      },
      {
        type: 'image',
        src: 'img/kurita_mechanism.png',
      },
    ],
    doi: '10.1109/IROS.2011.6094613',
    publication: 'IEEE/RSJ IROS',
    year: '2011',
    audit: {
      score: 2,
      ticks_str: '2',
      sensations: ['Friction', 'Weight magnitude'],
      status: 'auditable',
    },
  },
  {
    name: 'Lin and Smith',
    category: 'Plate shearing',
    author: 'Chia-Wei Lin, Shana Smith',
    title: 'The Effect of Kinetic Friction on Lateral Stroking Perception in a Virtual Environment',
    mechanism: 'One module stretches the fingerpad for kinetic friction while a second vibrates for texture.',
    useCaseText:
      'Evaluating psychophysical tactile perception, lateral friction cues, and texture discrimination in VR.',
    useCaseTags: ['Friction cues', 'Lateral stroking', 'Linear friction stage'],
    generalUseCases: ['Gaming', 'Training'],
    submodalities: ['Friction', 'Vibration'],
    media: [
      {
        type: 'image',
        src: 'img/linsmith.jpg',
      },
      {
        type: 'image',
        src: 'img/linsmith_mechanism.jpg',
      },
    ],
    doi: '10.1177/00187208261429019',
    publication: 'Human Factors',
    year: '2026',
    audit: {
      score: 2,
      ticks_str: '2',
      sensations: ['Friction', 'Vibration'],
      status: 'added',
    },
  },
  {
    name: 'iGripper',
    category: 'Spring loading',
    author: 'Ke Shi, Tongshu Chen, Yichen Xiang, Ye Li, Lifeng Zhu, Aiguo Song',
    title: 'iGripper: A Semi-Active Handheld Haptic VR Controller Based on Variable Stiffness Mechanism',
    mechanism: 'A linear actuator slides a spring along a lever arm, so its reaction sets the felt stiffness.',
    useCaseText:
      'Rendering dynamic variable stiffness, elasticity, and rigid boundary stops when gripping, clamping, or pressing tools and compliant objects in virtual reality.',
    useCaseTags: ['Stiffness cues', 'Elastic resistance', 'Rigid stop cues', 'Object simulation'],
    generalUseCases: ['Gaming', 'Training', 'Object simulation'],
    submodalities: ['Stiffness', 'Resistance'],
    media: [
      {
        type: 'image',
        src: 'img/igripper.jpg',
      },
      {
        type: 'image',
        src: 'img/igripper_mechanism.jpg',
      },
    ],
    doi: '10.1145/3706598.3714291',
    publication: 'ACM CHI',
    year: '2025',
    audit: {
      score: 1,
      ticks_str: '1',
      sensations: ['Stiffness'],
      status: 'auditable',
    },
  },
  {
    name: 'Shi et al.',
    category: 'Spring loading',
    author: 'Ke Shi, Quan Xiong, Maozeng Zhang, Aiguo Song, Lifeng Zhu',
    title:
      'A Handheld Stiffness Display with a Programmable Spring and Electrostatic Clutches for Haptic Interaction in Virtual Reality',
    mechanism: 'A programmable spring with electrostatic clutches resists finger flexion in elastic and rigid modes.',
    useCaseText:
      'Providing high-force, low-power stiffness feedback across a wide dynamic range for grasping objects with variable elasticity and rigid geometry in VR.',
    useCaseTags: ['Stiffness cues', 'Elastic resistance', 'Rigid boundary cues', 'Low-power haptics'],
    generalUseCases: ['Gaming', 'Medical simulation', 'Training'],
    submodalities: ['Stiffness', 'Resistance'],
    media: [
      {
        type: 'image',
        src: 'img/shi.jpg',
      },
      {
        type: 'image',
        src: 'img/shi_mechanism.jpg',
      },
    ],
    doi: '10.1109/TVCG.2025.3616795',
    publication: 'IEEE TVCG',
    year: '2025',
    audit: {
      score: 1,
      ticks_str: '1',
      sensations: ['Stiffness'],
      status: 'updated',
    },
  },
  {
    name: 'Triggermuscle',
    category: 'Spring loading',
    author: 'Carolin Stellmacher, Michael Bonfert, Ernst Kruijff, Johannes Schöning',
    title:
      'Triggermuscle: Exploring Weight Perception for Virtual Reality Through Adaptive Trigger Resistance in a Haptic VR Controller',
    mechanism: 'A spring mechanism inside a Vive controller varies trigger resistance as the finger pulls.',
    useCaseText:
      'Rendering virtual weight sensations and object heft through dynamic index-finger trigger resistance adjustments in virtual environments.',
    useCaseTags: ['Resistance cues', 'Weight magnitude cues', 'Trigger feedback', 'Object manipulation'],
    generalUseCases: ['Gaming', 'Training', 'Object simulation'],
    submodalities: ['Resistance', 'Weight magnitude'],
    media: [
      {
        type: 'image',
        src: 'img/triggermuscle.jpg',
      },
      {
        type: 'image',
        src: 'img/triggermuscle_mechanism.jpg',
      },
      {
        type: 'video',
        src: 'https://www.youtube.com/watch?v=E54waVJfH5Q',
      },
    ],
    doi: '10.3389/frvir.2021.754511',
    publication: 'Frontiers in Virtual Reality',
    year: '2021',
    audit: {
      score: 2,
      ticks_str: '2',
      sensations: ['Resistance', 'Weight magnitude'],
      status: 'auditable',
    },
  },
  {
    name: 'Berna-Moya et al.',
    category: 'Mass striking',
    author: '',
    title: '',
    mechanism: 'A pneumatic cylinder displaces a weight along a gun barrel, replicating shape, weight and recoil.',
    useCaseText: 'Providing active impact cues in virtual reality interactions.',
    useCaseTags: ['Impact cues'],
    generalUseCases: ['Gaming', 'Training'],
    submodalities: ['Impact'],
    media: [
      {
        type: 'image',
        src: 'img/bernamoya.jpg',
      },
      {
        type: 'image',
        src: 'img/bernamoya_mechanism.jpg',
      },
    ],
    doi: '',
    publication: 'INTERACT',
    year: '2019',
    audit: {
      score: 1,
      ticks_str: '1',
      sensations: ['Impact'],
      status: 'auditable',
    },
  },
  {
    name: 'FeelCoilins',
    category: 'Mass striking',
    author: 'Jasper Flügge, Luca Hilbrich, Alexander Kalus, Katrin Wolf',
    title: 'FeelCoilins: Enhancing Virtual Drumming with Ungrounded Force Feedback via Solenoid Actuation',
    mechanism: 'Two solenoids in each drumstick strike the housing at the moment of virtual drum contact.',
    useCaseText:
      'Providing realistic impact rebound and tactile feedback during virtual drumming and rhythm gaming.',
    useCaseTags: ['Impact cues', 'Solenoid plunger', 'Virtual drumming'],
    generalUseCases: ['Gaming', 'Training'],
    submodalities: ['Impact'],
    media: [
      {
        type: 'image',
        src: 'img/feelcoilins.png',
      },
      {
        type: 'image',
        src: 'img/feelcoilins_mechanism.jpg',
      },
    ],
    doi: '10.1145/3743049.3748588',
    publication: 'Mensch und Computer',
    year: '2025',
    audit: {
      score: 1,
      ticks_str: '1',
      sensations: ['Impact'],
      status: 'auditable',
    },
  },
  {
    name: 'HapticCollider',
    category: 'Mass striking',
    author: '',
    title: '',
    mechanism: 'A servo releases a 394 g hammerhead against the wooden handle, giving a rigid tool collision.',
    useCaseText: 'Providing active impact cues in virtual reality interactions.',
    useCaseTags: ['Impact cues'],
    generalUseCases: ['Gaming', 'Training'],
    submodalities: ['Impact'],
    media: [
      {
        type: 'image',
        src: 'img/hapticcollider.png',
      },
      {
        type: 'image',
        src: 'img/hapticcollider_mechanism.png',
      },
    ],
    doi: '',
    publication: '',
    year: '',
    audit: {
      score: 1,
      ticks_str: '1',
      sensations: ['Impact'],
      status: 'auditable',
    },
  },
  {
    name: 'MMGrip',
    category: 'Mass striking',
    author: 'Dong-Geun Kim, Jungeun Lee, Seungmoon Choi',
    title:
      'MMGrip: A Handheld Multimodal Haptic Device Combining Vibration, Impact, and Shear for Realistic Expression of Contact',
    mechanism: 'Vibration, impact and shear are combined in one grip so contact events read as realistic.',
    useCaseText:
      'Rendering synchronized high-bandwidth vibration, collision impacts, and lateral shear in virtual reality.',
    useCaseTags: ['Impact cues', 'Multimodal haptics', 'Tri-actuator architecture'],
    generalUseCases: ['Gaming', 'Training'],
    submodalities: ['Friction', 'Vibration', 'Impact'],
    media: [
      {
        type: 'image',
        src: 'img/mmgrip.jpg',
      },
      {
        type: 'image',
        src: 'img/mmgrip_mechanism.jpg',
      },
    ],
    doi: '10.1145/3550082.3564177',
    publication: 'ACM SIGGRAPH Asia Posters',
    year: '2022',
    audit: {
      score: 3,
      ticks_str: '3',
      sensations: ['Friction', 'Vibration', 'Impact'],
      status: 'auditable',
    },
  },
  {
    name: 'transPAF',
    category: 'Mass striking',
    author: 'Hong-Xian Chen, Shih-Kang Chiu, Chi-Ching Wen, Hsin-Ruey Tsai',
    title:
      'transPAF: Rendering Omnidirectional Impact Feedback with Dynamic Point of Application of Force All Round a Controller',
    mechanism: 'Rotatable tracks carry an impactor all round the controller, placing impact at any point.',
    useCaseText:
      'Delivering omnidirectional impact cues from projectiles, sword parries, and spatial collisions in VR.',
    useCaseTags: ['Impact cues', 'Omnidirectional carriage', '360-degree impact'],
    generalUseCases: ['Gaming', 'Training'],
    submodalities: ['Impact'],
    media: [
      {
        type: 'image',
        src: 'img/transpaf.png',
      },
      {
        type: 'image',
        src: 'img/transpaf_mechanism.png',
      },
    ],
    doi: '10.1145/3544548.3581092',
    publication: 'ACM CHI',
    year: '2023',
    audit: {
      score: 1,
      ticks_str: '1',
      sensations: ['Impact'],
      status: 'auditable',
    },
  },
  {
    name: 'FresnelDeform',
    category: 'Plate tilting',
    author:
      'Hiroki Ota, Yutaro Hirao, Monica Perusquía-Hernández, Hideaki Uchiyama, Kiyoshi Kiyokawa, Maud Marchal',
    title:
      'FresnelDeformable: A Softness Presentation Technique Combining Fingertip Plane Tilt Manipulation and Pseudo-Stiffness',
    mechanism: 'Servos tilt each fingertip contact plane in response to applied force, presenting softness.',
    useCaseText:
      'Simulating elastic softness and variable material compliance through fingertip contact-plane tilt.',
    useCaseTags: ['Stiffness cues', 'Contact plane tilt', 'Pseudo-stiffness'],
    generalUseCases: ['Gaming', 'Training'],
    submodalities: ['Stiffness'],
    media: [
      {
        type: 'image',
        src: 'img/fresneldeform.jpg',
      },
      {
        type: 'image',
        src: 'img/fresneldeform_mechanism.jpg',
      },
    ],
    doi: '10.1145/3706599.3719778',
    publication: 'ACM CHI EA',
    year: '2025',
    audit: {
      score: 1,
      ticks_str: '1',
      sensations: ['Stiffness'],
      status: 'added',
    },
  },
  {
    name: 'FresnelShape',
    category: 'Plate tilting',
    author:
      'Hiroki Ota, Yutaro Hirao, Monica Perusquía-Hernández, Hideaki Uchiyama, Kiyoshi Kiyokawa, Maud Marchal',
    title: 'FresnelShape: A Contact-Plane Tilt Haptic Display for Enhancing Visuo-Haptic Coherence',
    mechanism: 'Fins tilt at three fingertips to render the local orientation of the virtual surface touched.',
    useCaseText:
      'Enhancing visuo-haptic coherence and realistic 3D surface curvature during multi-finger VR manipulation.',
    useCaseTags: ['Shape cues', '3-finger tilting plates', 'Surface tangent tracking'],
    generalUseCases: ['Gaming', 'Training'],
    submodalities: ['Shape'],
    media: [
      {
        type: 'image',
        src: 'img/fresnelshape.jpg',
      },
      {
        type: 'image',
        src: 'img/fresnelshape_mechanism.jpg',
      },
    ],
    doi: '10.1109/ACCESS.2026.3676739',
    publication: 'IEEE Access',
    year: '2026',
    audit: {
      score: 1,
      ticks_str: '1',
      sensations: ['Shape'],
      status: 'auditable',
    },
  },
  {
    name: 'NormalTouch',
    category: 'Plate tilting',
    author: 'Hrvoje Benko, Christian Holz, Mike Sinclair, Eyal Ofek',
    title:
      'NormalTouch and TextureTouch: High-fidelity 3D Haptic Shape Rendering on Handheld Virtual Reality Controllers',
    mechanism: 'A tilting, extruding platform under the fingertip traces the geometry of virtual objects.',
    useCaseText:
      'Rendering accurate 3D surface normals, planar contours, and rigid shape boundaries in virtual environments.',
    useCaseTags: ['Shape cues', 'Stewart platform', 'Surface normal tilt'],
    generalUseCases: ['Gaming', 'Training'],
    submodalities: ['Shape'],
    media: [
      {
        type: 'image',
        src: 'img/normaltouch.jpg',
      },
      {
        type: 'image',
        src: 'img/normaltouch_mechanism.jpg',
      },
    ],
    doi: '10.1145/2984511.2984526',
    publication: 'ACM UIST',
    year: '2016',
    audit: {
      score: 1,
      ticks_str: '1',
      sensations: ['Shape'],
      status: 'auditable',
    },
  },
  {
    name: 'Stuet',
    category: 'Plate tilting',
    author: 'Ulan Kelesbekov, Gabriele Marini, Zhongyi Bai, Wafa Johal, Eduardo Velloso, Jarrod Knibbe',
    title: 'Stuet: Dual Stewart Platforms for Pinch Grasping Objects in VR',
    mechanism: 'Dual Stewart platforms set pinch width and tilt, rendering the form held between two fingers.',
    useCaseText:
      'Enabling high-fidelity two-finger pinch grasping and shape exploration of virtual objects in VR.',
    useCaseTags: ['Shape cues', 'Dual Stewart platforms', 'Pinch grasping'],
    generalUseCases: ['Gaming', 'Training'],
    submodalities: ['Shape'],
    media: [
      {
        type: 'image',
        src: 'img/stuet.jpg',
      },
      {
        type: 'image',
        src: 'img/stuet_mechanism.png',
      },
    ],
    doi: '10.1109/ISMAR62088.2024.00045',
    publication: 'IEEE ISMAR',
    year: '2024',
    audit: {
      score: 1,
      ticks_str: '1',
      sensations: ['Shape'],
      status: 'auditable',
    },
  },
  {
    name: 'Cabaret et al.',
    category: 'Vibration',
    author: 'Pierre-Antoine Cabaret, Thomas Howard, Claudio Pacchierotti, Marie Babel, Maud Marchal',
    title: 'Perception of Spatialized Vibrotactile Impacts in a Hand-Held Tangible for Virtual Reality',
    mechanism: 'Two voice coils in a tracked handle spatialise a vibrotactile impact to a point in the hand.',
    useCaseText: 'Simulating spatialized point-of-impact sensations along a handheld virtual tool or sword.',
    useCaseTags: ['Impact cues', 'Spatialized vibration', 'Dual voice-coil actuators'],
    generalUseCases: ['Gaming', 'Training'],
    submodalities: ['Vibration', 'Impact'],
    media: [
      {
        type: 'image',
        src: 'img/cabaret.jpg',
      },
      {
        type: 'image',
        src: 'img/cabaret_mechanism.jpg',
      },
    ],
    doi: '10.1007/978-3-031-06249-0_30',
    publication: 'EuroHaptics',
    year: '2022',
    audit: {
      score: 2,
      ticks_str: '2',
      sensations: ['Vibration', 'Impact'],
      status: 'auditable',
    },
  },
  {
    name: 'DualVib',
    category: 'Vibration',
    author: '',
    title: '',
    mechanism: 'Four actuators combine asymmetric pseudo-force with texture vibration to fake dynamic mass.',
    useCaseText: 'Providing active vibration, weight magnitude cues in virtual reality interactions.',
    useCaseTags: ['Vibration cues', 'Weight magnitude cues'],
    generalUseCases: ['Gaming', 'Training'],
    submodalities: ['Vibration', 'Weight magnitude'],
    media: [
      {
        type: 'image',
        src: 'img/multivibes.jpg',
      },
      {
        type: 'image',
        src: 'img/dualvib_mechanism.jpg',
      },
    ],
    doi: '',
    publication: '',
    year: '',
    audit: {
      score: 2,
      ticks_str: '2',
      sensations: ['Vibration', 'Weight magnitude'],
      status: 'auditable',
    },
  },
  {
    name: 'Fong et al.',
    category: 'Vibration',
    author: 'Fong Wee Teck',
    title: 'Force and Torque Simulation in Virtual Tennis',
    mechanism: 'Four tennis prototypes, the first a push-pull solenoid, simulate racket force and torque.',
    useCaseText:
      'Simulating dynamic ball impact force, racket twist, and ball sweet-spot collisions in virtual tennis.',
    useCaseTags: ['Impact cues', 'Push-pull solenoid', 'Tennis racket simulation'],
    generalUseCases: ['Gaming', 'Training'],
    submodalities: ['Impact'],
    media: [
      {
        type: 'image',
        src: 'img/fong.png',
      },
      {
        type: 'image',
        src: 'img/fong_mechanism.png',
      },
    ],
    doi: '10.1145/2425296.2425321',
    publication: 'ACM SIGGRAPH Asia Workshop',
    year: '2012',
    audit: {
      score: 1,
      ticks_str: '1',
      sensations: ['Impact'],
      status: 'read, unresolved',
    },
  },
  {
    name: 'MultiVibes',
    category: 'Vibration',
    author: '',
    title: '',
    mechanism: 'Ten actuators touch the hand directly, so spatial vibration patterns do not blur through the body.',
    useCaseText: 'Providing active vibration cues in virtual reality interactions.',
    useCaseTags: ['Vibration cues'],
    generalUseCases: ['Gaming', 'Training'],
    submodalities: ['Vibration'],
    media: [
      {
        type: 'image',
        src: 'img/multivibes.png',
      },
      {
        type: 'image',
        src: 'img/multivibes_mechanism.jpg',
      },
    ],
    doi: '',
    publication: '',
    year: '',
    audit: {
      score: 1,
      ticks_str: '1',
      sensations: ['Vibration'],
      status: 'auditable',
    },
  },
  {
    name: 'PowVRtool',
    category: 'Vibration',
    author:
      'Mayank Patel, Asim Unmesh, A. Ipsita, Levi Erickson, Priyam Maheshwari, Rahul Jain, Jingyu Shi, Laura H. Blumenschein, Karthik Ramani',
    title:
      'PowVRtool: A Handheld Haptic Device for Realistic Power Tool Feedback in VR-based Manufacturing Training',
    mechanism: 'An LRA, an ERM motor and a magnetic ram together render power-tool vibration and impulse.',
    useCaseText:
      'Industrial power tool simulation, manufacturing assembly training, and vocational education in VR.',
    useCaseTags: ['Vibration cues', 'Impact cues', 'Hybrid power tool actuators'],
    generalUseCases: ['Gaming', 'Training'],
    submodalities: ['Vibration', 'Impact'],
    media: [
      {
        type: 'image',
        src: 'img/powvrtool.png',
      },
      {
        type: 'image',
        src: 'img/powvrtool_mechanism.png',
      },
    ],
    doi: '10.1007/s10055-025-01258-2',
    publication: 'Virtual Reality',
    year: '2025',
    audit: {
      score: 2,
      ticks_str: '2',
      sensations: ['Vibration', 'Impact'],
      status: 'auditable',
    },
  },
  {
    name: 'TORC',
    category: 'Vibration',
    author: 'Jaeyeon Lee, Mike Sinclair, Mar Gonzalez-Franco, Eyal Ofek, Christian Holz',
    title: 'TORC: A Virtual Reality Controller for In-Hand High-Dexterity Finger Interaction',
    mechanism: 'Voice coils under each finger rest render texture, and stiffness as an illusion, no moving parts.',
    useCaseText:
      'Enabling high-dexterity virtual object squeezing, compliant surface feeling, and in-hand manipulation.',
    useCaseTags: ['Stiffness cues', 'Vibration cues', 'Collocated voice-coil'],
    generalUseCases: ['Gaming', 'Training'],
    submodalities: ['Stiffness', 'Vibration'],
    media: [
      {
        type: 'image',
        src: 'img/torc.png',
      },
      {
        type: 'image',
        src: 'img/torc_mechanism.png',
      },
    ],
    doi: '10.1145/3290605.3300301',
    publication: 'ACM CHI',
    year: '2019',
    audit: {
      score: 2,
      ticks_str: '2',
      sensations: ['Stiffness', 'Vibration'],
      status: 'auditable',
    },
  },
  {
    name: 'VibeRo',
    category: 'Vibration',
    author: 'Adilzhan Adilkhanov, Amir Yelenov, Ramakanth Singal Reddy, Alexander Terekhov, Zhanat Kappassov',
    title: 'VibeRo: Vibrotactile Stiffness Perception Interface for Virtual Reality',
    mechanism: 'A voice coil squeezes the fingertips, turning vibrotactile output into perceived softness.',
    useCaseText: 'Presenting variable virtual elasticity and compliant object grasping in VR simulations.',
    useCaseTags: ['Stiffness cues', 'Dual-pinned voice-coil', 'Fingertip squeeze'],
    generalUseCases: ['Gaming', 'Training'],
    submodalities: ['Stiffness'],
    media: [
      {
        type: 'image',
        src: 'img/vibero.jpg',
      },
      {
        type: 'image',
        src: 'img/vibero_mechanism.jpg',
      },
    ],
    doi: '10.1109/LRA.2020.2972793',
    publication: 'IEEE RA-L',
    year: '2020',
    audit: {
      score: 1,
      ticks_str: '1',
      sensations: ['Stiffness'],
      status: 'added',
    },
  },
];
