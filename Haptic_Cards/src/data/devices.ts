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
    mechanism:
      'Dual servo-driven folding fans rapidly expand up to 650% in 570 ms, dynamically manipulating both aerodynamic drag and weight distribution to simulate virtual gas/fluid resistance, virtual mass, and weapon grasping.',
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
    mechanism:
      'Two sliding planar surfaces driven by motorized timing belts change their overlap and position relative to the grip, modulating both aerodynamic drag resistance and center-of-gravity shifts to render 2D object shapes.',
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
    mechanism:
      'Compressed air propulsion jets mounted on dual counter-rotating swingarms accumulate kinetic momentum to amplify ungrounded impact force up to 40 N with rapid 3 ms rise time.',
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
    mechanism:
      'Pneumatic high-speed solenoid valves modulate compressed air jets across three interchangeable racket geometries (ping-pong, badminton, tennis) with perceptual duration scaling to amplify perceived impact force.',
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
    mechanism:
      'High-speed pneumatic solenoid valves deliver 20–50 Hz air impulses (1.0–4.0 N) through a 120° 5-nozzle manifold configured to steer ungrounded 3-DoF propulsion forces away from the user.',
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
    mechanism:
      'Reconfigurable brush hair modules mounted on finger segments use servo actuators to dynamically adjust hair length, tilt direction, and pin heights, realistically rendering multilevel tactile stiffness, roughness, and surface height.',
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
    mechanism:
      'Four independent motors dynamically bend and stretch a flexible brass shape-changing tape within the controller, controlling curvature and elastic compliance to simulate 3D object geometries and multilevel softness.',
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
    mechanism:
      'A modular multimodal VR controller featuring a pneumatically actuated silicone airbag on the thumb module for softness and pressure feedback, combined with a Peltier thermoelectric element and vibration motor on the palm module.',
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
    mechanism:
      'A friction-based capstan-plus-cord brake mechanism driven by a miniature low-power motor amplifies user-supplied gripping force by up to 40x, rendering rigid and compliant virtual surfaces with high holding force and low latency.',
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
    mechanism:
      'A motorized rotating arm tracks the index finger to actuate resistive grasping forces and trigger resistance, while an integrated voice-coil actuator on the fingertip delivers high-bandwidth vibrotactile textures and impact pulses.',
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
    mechanism:
      'Configurable planar mechanical linkage systems driven by active and passive joint actuators rapidly prototype kinematic motion and force feedback for diverse virtual hand tools (pliers, scissors, syringes, wrenches).',
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
    mechanism:
      'Electro-mechanical variable stiffness linkages (Layer-Hinge, Chain, and Ratchet) connect two VR controllers, electrostatically and mechanically locking multi-DOF relative motion to render rigid, constrained, and compliant bimanual objects.',
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
    mechanism:
      'Four servomotors wind spools to independently tension four elastic tendons along a 2-DOF flexible joint, dynamically modulating bending stiffness and damping to realistically render flexible virtual objects.',
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
    mechanism:
      'A pair of VR controllers connected by an elastic link utilizing motorized rotatable tracks to dynamically reposition the Point of Application of Force (PAF) and wind the band, rendering directional resistive forces and impact moments.',
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
    mechanism:
      'Elastic bands and controllable damping mechanisms suspend a moving proxy mass in 3D space within the controller, dynamically rendering 3D damped oscillation effects and shifting center of mass.',
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
    mechanism:
      'Five micro-linear pin actuators individually resist each finger with up to 22 N, coupled with independent pressure sensing and a grip vibrator to deliver individual finger stiffness and dynamic grasp weight cues.',
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
    mechanism:
      'A 3x5 tactile pin array embedded in the controller handle actuates miniature push-pins into the fingers and palm, rendering continuous 2D directional pressure vectors and multi-directional impact cues.',
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
    mechanism:
      'A handheld shape display featuring 36 motorized linear pins distributed across two opposing faces that dynamically extend to render 2.5D physical shapes, contours, and physical button affordances directly in the palm.',
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
    mechanism:
      'A 4x4 matrix of independently actuated pins mounted on a handheld VR controller dynamically elevates pins to conform to virtual surface geometries, rendering fine-grained physical textures and 3D surface profiles.',
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
    mechanism:
      'A high-speed flywheel mounted inside a Japanese wooden sword (shinai) handle is rapidly braked by a mechanical clutch to transfer rotational angular momentum into sharp collision impact forces.',
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
    mechanism:
      'A gimballed flywheel tilts to steer gyroscopic torque across impact, motion and resistance cues.',
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
    mechanism:
      'A high-speed momentum wheel suspended inside a motorized two-axis Cardan gimbal generates continuous ungrounded gyroscopic precession torques (up to 1.4 Nm) to guide user hand motions.',
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
    mechanism:
      'Opposed high-speed control moment gyroscopes (CMGs) with rotational impedance control dynamically vary apparent rotational inertia, damping, and 3-DoF moment of inertia in real time.',
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
    mechanism:
      'A single high-torque DC motor embedded inside a racket grip is pulsed with asymmetric bidirectional drive waveforms to render sharp impact shocks while suppressing directional torque perception.',
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
    mechanism:
      'A flywheel is fired and braked to produce directional impact, optimised for physical and felt force.',
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
    mechanism:
      'Fully encapsulated flywheel modules attach to objects, prototyping kinesthetic and movement cues.',
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
    mechanism:
      'Modular interchangeable haptic cubes attach onto a core handheld controller chassis, dynamically combining vibration, impact, thermal, variable inertia, and magnetorheological (MR) fluid variable stiffness actuators.',
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
    mechanism:
      'Plug-and-feel modular tactile blocks snap onto Cardboard VR headsets and controllers, instantly routing power and signals to thermal thermoelectric Peltier units and vibrotactile actuators.',
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
    mechanism:
      'An open-source toolkit combining functional active Voxels (integrated actuators for vibration, sensing, and resistance) with modular tactile Plates (shape, texture, weight) to rapidly build versatile VR haptic proxy objects.',
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
    mechanism:
      'Pumps move water between dual reservoirs driven by stepper motor syringes to dynamically modulate total mass up to 500g and shift center of gravity.',
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
    mechanism:
      'Bi-directional pumping transfers liquid into and out of a handheld cup bladder, dynamically modulating mass and inertia during pouring and filling.',
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
    mechanism:
      'Decoupled docking base station transfers liquid up to 1 kg at 235 g/s into untethered handheld controller proxies for unencumbered room-scale VR.',
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
    mechanism:
      'A high-speed bi-directional water pump coupled with miniature solenoid valves rapidly transfers liquid mass in and out of the handheld controller chambers, dynamically modulating absolute physical weight to render virtual objects and avatar limb weight.',
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
    mechanism:
      'A handheld haptic display utilizing high-density liquid metal transferred between internal chambers to simultaneously modulate absolute mass and center of gravity (CoG), coupled with a voice-coil actuator for high-definition contact vibration cues.',
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
    mechanism:
      'Motorized internal weight-shifting modules in two versatile controllers dynamically modulate center of mass, impact force, and perceived volume.',
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
    mechanism:
      'A motor slides an internal weight along a rod, altering perceived length, thickness and heaviness.',
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
    mechanism:
      'Motorized dual-axis linear rails rapidly translate internal solid brass masses driven by real-time smoothed-particle hydrodynamics (SPH) physics, recreating the dynamic shifting center-of-gravity of sloshing liquids in handheld virtual vessels.',
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
    mechanism:
      'Two motorized arms equipped with counterweights expand and rotate in 2-DOF space to dynamically alter mass distribution and rotational inertia, rendering diverse 2D virtual weapon and tool shapes via a computational perception model.',
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
    mechanism:
      'Timing belt drives an internal movable mass along the grip at high speed, altering rotational inertia during user swings to evoke sharp impact sensations.',
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
    mechanism:
      'Linear motion guide moves an internal weight along the central axis to dynamically displace the center of gravity and modulate angular moment.',
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
    mechanism:
      'Tracked physical props with modular mass distribution calibrate passive weight matching against active vibrotactile feedback.',
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
    mechanism:
      'Paired unlinked controllers actuate bending and twisting servo backbones in real-time, creating the haptic illusion of a single connected deformable object between both hands.',
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
    mechanism:
      'Soft pneumatic elastomeric handle sleeve dynamically inflates and deflates to modulate grip diameter and compliance between rigid and compressible states.',
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
    mechanism:
      'Two motorized wings adjust their opening angles dynamically via servo motors against the palm and fingers to render object dimensions, geometry, and contact stiffness.',
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
    mechanism:
      'Single gear motor rotates radial poles along geared tracks to transform the grip into distinct symmetrical 3D cross-sections and contours.',
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
    mechanism:
      'Internal linear servo actuator repositions the thumb rest along the handle axis to dynamically manipulate grip span and trick visuo-haptic perception of object weight and size.',
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
    mechanism:
      'A vertical stack of four motorized expandable rings dynamically expands and contracts within ~100 ms to form full 360° graspable shapes with capacitive touch sensing.',
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
    mechanism:
      'High-density electrotactile arrays lining the container fingerpad contact surfaces render spatial fluid sloshing pressure and shear waves computed via real-time SPH liquid simulation.',
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
    mechanism:
      'Dynamic electrotactile stimulation on flexible fingerpad electrode arrays delivers micro-slip sensations when grip force drops below virtual weight thresholds, compelling firmer grip and inducing weight perception.',
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
    mechanism:
      'Dual motorized Peltier thermoelectric arrays pressed against fingertips and palm deliver rapid cooling combined with tactile pressure to induce realistic multi-level wetness illusions.',
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
    mechanism:
      'Miniature Peltier thermoelectric element coupled with a compact heat sink and cooling fan mounted on a smart 3D sketch pen provides dynamic thermal heating and cooling to the index finger during VR drawing.',
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
    mechanism:
      'Two miniature electric ducted fan propellers dynamically shift thrust vectors to generate continuous 2D planar weight motion and inertia illusions up to 14 N within 0.3 s.',
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
    mechanism:
      'Dual counter-rotating propellers mounted inside a 2-DoF motorized gimbal cage with linear sliders continuously orient 3D force vectors up to 15 N and decoupled torques up to 1.0 N·m in <370 ms.',
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
    mechanism:
      'An autonomous quadrotor flies to the user on demand, then transitions into a handheld joystick whose thrust is dynamically reallocated to render multi-axis kinesthetic forces and torques.',
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
    mechanism:
      "Autonomous micro-quadcopters deliver physical 3D-printed UI elements and tangible interactive handles to the user's hand on demand in mid-air.",
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
    mechanism:
      'Hybrid handheld controller integrating four toroidal brushless propellers for continuous aerodynamic thrust combined with an electromagnetic linear solenoid accelerating a 90 g slug to generate 26 N peak impulsive recoil.',
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
    mechanism:
      'Multirotor thruster assemblies mounted at both ends of a two-handed carbon pole generate dynamic mid-air rotational torque and linear resistance forces up to 15 N.',
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
    mechanism:
      'Six high-thrust motors and propellers positioned along orthogonal cube faces synthesize arbitrary 3-DoF ungrounded directional force vectors up to 4 N to simulate weight, drag, and impact forces.',
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
    mechanism:
      'A 2-DOF spherical mass shifting mechanism moves a guided impact mass along hemispherical coordinates and rapidly decelerates it, delivering high-magnitude 3D directional impact forces and torque sensations to the hand.',
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
    mechanism:
      'An ungrounded voice-coil linear actuator drives an internal inertial mass with sharp acceleration pulses and slow sub-threshold return strokes, generating convincing directional firearm recoil kicks.',
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
    mechanism:
      'Asymmetric vertical acceleration pulses via voice-coil / linear shaker distort perceived object heaviness through nonlinear biological force integration.',
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
    mechanism:
      "A motorized tape-reel mechanism embedded in the grip dynamically winds and unwinds a flexible band across the user's fingertip, applying controlled shear traction and deformation.",
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
    mechanism:
      'A rotating mechanical multi-texture disc positioned under the index finger indexes multiple tangible swatch materials, rendering active surface texture and micro-roughness transitions.',
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
    mechanism:
      'An actuated wheel embedded in the controller raises to contact the index finger and spins in two directions to render continuous shear friction, contact normal pressure, and surface textures.',
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
    mechanism:
      "Dual independent motorized roller modules arranged symmetrically along the grip drive high-friction cylindrical rollers against the user's palm to present continuous bi-directional shear force.",
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
    mechanism:
      'A motorized active thumbwheel driven by a precision DC motor is coupled with orthogonal optical force sensing cantilevers, synthesizing programmable detents, spring forces, and friction drag.',
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
    mechanism:
      "Active motorized textured rollers integrated on a handheld wand continuously rotate against the user's skin at controlled relative velocities to simulate diverse tactile roughness and sliding friction.",
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
    mechanism:
      "A miniature trackball taxel driven by dual high-speed micro motors rotates beneath the user's fingertip, rendering omnidirectional continuous shear slip and fine surface micro-textures.",
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
    mechanism:
      "Two high-friction counter-rotating slip rings actuated by miniature gearmotors contact the user's thumb and index finger to deliver continuous skin stretch and kinetic friction cues.",
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
    mechanism:
      'A motorized leadscrew actuator translates and shears a contact pad against the fingertip, independently controlling normal indentation and lateral shear displacement up to 10 mm.',
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
    mechanism:
      'A linear voice-coil driven sliding plate modulates the kinetic friction and slip ratio beneath the fingertip pad, inducing an illusion of shifting weight and lateral shear resistance.',
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
    mechanism:
      "A motorized linear stage moves physical texture plates across the participant's restrained finger pad, measuring perceptual thresholds for lateral friction stroking in virtual environments.",
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
    mechanism:
      "A variable stiffness mechanism uses a miniature linear actuator to shift the position of a compression spring along a lever arm, modulating physical stiffness from zero up to the spring's maximum limit, while a blocking latch renders complete rigidity.",
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
    mechanism:
      'Combines a programmable spring (PS) actuated by an adjustable lever arm with dual electrostatic clutches (ECs) to render three distinct haptic states: free motion (ECs off), controllable elastic force (1st EC active), and rigid locking (both ECs active).',
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
    mechanism:
      'A motorized dynamic spring mechanism integrated inside an HTC Vive controller chassis dynamically and continuously alters trigger pull resistance proportionally to simulated virtual object weight, demanding proportional index-finger grasping force.',
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
    mechanism: 'Pneumatic cylinder drives 240g weight for sharp impact recoil in gun controller.',
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
    mechanism:
      'Push-pull electromagnetic solenoids embedded inside drumstick controllers accelerate steel plungers to strike internal impact plates, rendering transient ungrounded drumhead collision recoil.',
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
    mechanism: 'Internal mass strikes handle stop for rigid collision feedback.',
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
    mechanism:
      'An integrated multimodal controller combining a voice coil for vibrotactile textures, a solenoid impactor for rigid collisions, and a linear servo shear pad for frictional skin stretch.',
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
    mechanism:
      'A motorized circular carriage rotates an electromagnetic impact striker 360 degrees around the cylindrical grip, steering ungrounded ballistic impact forces to any contact point on the hand.',
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
    mechanism:
      "Miniature servomotors tilt a contact plate beneath the user's fingertip in response to applied pinch force, modulating local contact area to evoke perceptual softness compliance.",
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
    mechanism:
      'Three independent servo-actuated contact plates contact the thumb, index, and middle fingertips, dynamically tilting to match local 3D surface tangent planes of touched virtual objects.',
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
    mechanism:
      'A 3-DoF Stewart platform beneath the index fingertip tilts and extrudes vertically to match virtual surface normals and contact pressure, simulating rigid 3D object geometry.',
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
    mechanism:
      'Dual miniature 3-DoF Stewart platforms mounted on the controller handle articulate against both thumb and index fingertips simultaneously, rendering grasp width, tilt, and surface contours.',
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
    mechanism:
      'Dual voice-coil actuators located at opposite ends of a cylindrical handle deliver coordinated vibrotactile impact pulses, synthesizing apparent spatialized impact locations along the hand via amplitude panning.',
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
    mechanism: 'Dual voice coils generate acoustic vibrations for texture and pseudo-force.',
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
    mechanism:
      'High-force push-pull electromagnetic solenoids embedded in a racket shaft accelerate masses along orthogonal axes to generate realistic ungrounded impact shocks and off-center torsional torques.',
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
    mechanism: 'Vibromotors create spatial tactile patterns.',
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
    mechanism:
      'A hybrid multimodal actuator architecture combining an ERM motor for sustained rotational rumble, an LRA for trigger clicks, and a high-force solenoid ram for hammer-drill kickback.',
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
    mechanism:
      'Force-sensing pads with collocated voice-coil actuators on thumb and finger rests synthesize pseudo-compliance and detailed micro-textures through synchronized force-modulated vibrotactile feedback.',
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
    mechanism:
      'A dual-pinned voice-coil actuator coupled with force sensing resistors (FSRs) laterally squeezes the index and thumb pads, rendering variable pseudo-stiffness profiles as pinch force increases.',
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
