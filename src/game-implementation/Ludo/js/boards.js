////////////////////////////////////////////////////////////
// BOARDS
////////////////////////////////////////////////////////////

var boards_arr = [
	{
		image:'assets/board1.png',
		scale:'1',
		dice:{
			x:290,
			y:288,
		},
		paths:[
			{x:328, y:364},
			{x:328, y:401},
			{x:328, y:437},
			{x:328, y:472},
			{x:328, y:509},
			{x:328, y:545},
			{x:292, y:545},
			{x:256, y:545},
			{x:256, y:509},
			{x:256, y:472},
			{x:256, y:437},
			{x:256, y:401},
			{x:256, y:364},
			{x:219, y:328},
			{x:183, y:328},
			{x:147, y:328},
			{x:110, y:328},
			{x:74, y:328},
			{x:38, y:328},
			{x:38, y:292},
			{x:38, y:255},
			{x:74, y:255},
			{x:110, y:255},
			{x:147, y:255},
			{x:183, y:255},
			{x:219, y:255},
			{x:256, y:219},
			{x:256, y:183},
			{x:256, y:146},
			{x:256, y:111},
			{x:256, y:75},
			{x:256, y:38},
			{x:292, y:38},
			{x:328, y:38},
			{x:328, y:75},
			{x:328, y:111},
			{x:328, y:146},
			{x:328, y:183},
			{x:328, y:219},
			{x:364, y:255},
			{x:400, y:255},
			{x:436, y:255},
			{x:472, y:255},
			{x:508, y:255},
			{x:544, y:255},
			{x:544, y:292},
			{x:544, y:328},
			{x:508, y:328},
			{x:472, y:328},
			{x:436, y:328},
			{x:400, y:328},
			{x:362, y:328},

		],
		players:[
			{
				startIndex:8,
				homdeIndex:6,
				saveIndex:16,
				startPos:[
					{x:128, y:418, scale:1},
					{x:128, y:496, scale:1},
					{x:89, y:458, scale:1},
					{x:168, y:459, scale:1},

				],
				homePos:[
					{x:260, y:336, scale:0.8},
					{x:280, y:336, scale:0.8},
					{x:300, y:336, scale:0.8},
					{x:317, y:336, scale:0.8},

				],
				homePath:[
					{x:292, y:509},
					{x:292, y:472},
					{x:292, y:437},
					{x:292, y:400},
					{x:292, y:364},

				],
				name:{
					x:130,
					y:550,
					fontSize:25,
					align:'center',
					color:'#000',
					rotation:0,
				},
				status:{
					x:130,
					y:370,
					fontSize:18,
					align:'center',
					color:'#000',
					rotation:0,
				},
				shape:[
					{x:19, y:310},
					{x:19, y:561},
					{x:309, y:562},
					{x:308, y:345},
					{x:344, y:345},
					{x:290, y:288},
					{x:237, y:344},
					{x:237, y:309},
					{x:18, y:310},

				],
			},

			{
				startIndex:21,
				homdeIndex:19,
				saveIndex:29,
				startPos:[
					{x:128, y:88, scale:1},
					{x:128, y:168, scale:1},
					{x:90, y:128, scale:1},
					{x:168, y:127, scale:1},

				],
				homePos:[
					{x:247, y:262, scale:0.8},
					{x:247, y:280, scale:0.8},
					{x:247, y:300, scale:0.8},
					{x:247, y:318, scale:0.8},

				],
				homePath:[
					{x:74, y:292},
					{x:110, y:292},
					{x:147, y:292},
					{x:183, y:292},
					{x:219, y:292},

				],
				name:{
					x:130,
					y:48,
					fontSize:25,
					align:'center',
					color:'#000',
					rotation:0,
				},
				status:{
					x:130,
					y:228,
					fontSize:18,
					align:'center',
					color:'#000',
					rotation:0,
				},
				shape:[
					{x:20, y:308},
					{x:18, y:18},
					{x:274, y:20},
					{x:272, y:236},
					{x:238, y:236},
					{x:290, y:288},
					{x:236, y:346},
					{x:236, y:309},
					{x:19, y:308},

				],
			},

			{
				startIndex:34,
				homdeIndex:32,
				saveIndex:42,
				startPos:[
					{x:453, y:87, scale:1},
					{x:454, y:167, scale:1},
					{x:414, y:127, scale:1},
					{x:494, y:128, scale:1},

				],
				homePos:[
					{x:260, y:247, scale:0.8},
					{x:280, y:247, scale:0.8},
					{x:300, y:247, scale:0.8},
					{x:317, y:247, scale:0.8},

				],
				homePath:[
					{x:292, y:75},
					{x:292, y:111},
					{x:292, y:146},
					{x:292, y:183},
					{x:292, y:219},

				],
				name:{
					x:455,
					y:48,
					fontSize:25,
					align:'center',
					color:'#000',
					rotation:0,
				},
				status:{
					x:455,
					y:228,
					fontSize:18,
					align:'center',
					color:'#000',
					rotation:0,
				},
				shape:[
					{x:273, y:19},
					{x:273, y:237},
					{x:235, y:236},
					{x:289, y:287},
					{x:346, y:237},
					{x:346, y:271},
					{x:562, y:273},
					{x:561, y:19},
					{x:273, y:18},

				],
			},

			{
				startIndex:47,
				homdeIndex:45,
				saveIndex:3,
				startPos:[
					{x:455, y:418, scale:1},
					{x:451, y:498, scale:1},
					{x:414, y:458, scale:1},
					{x:494, y:458, scale:1},

				],
				homePos:[
					{x:334, y:262, scale:0.8},
					{x:334, y:280, scale:0.8},
					{x:334, y:300, scale:0.8},
					{x:334, y:318, scale:0.8},

				],
				homePath:[
					{x:508, y:292},
					{x:472, y:292},
					{x:436, y:292},
					{x:400, y:292},
					{x:364, y:292},

				],
				name:{
					x:455,
					y:550,
					fontSize:25,
					align:'center',
					color:'#000',
					rotation:0,
				},
				status:{
					x:455,
					y:370,
					fontSize:18,
					align:'center',
					color:'#000',
					rotation:0,
				},
				shape:[
					{x:309, y:560},
					{x:310, y:345},
					{x:345, y:344},
					{x:289, y:287},
					{x:346, y:237},
					{x:564, y:237},
					{x:563, y:565},
					{x:309, y:562},

				],
			},


		],
	},

	{
		image:'assets/board2.png',
		scale:'0.95',
		dice:{
			x:325,
			y:315,
		},
		paths:[
			{x:408, y:374},
			{x:429, y:404},
			{x:451, y:434},
			{x:472, y:462},
			{x:492, y:491},
			{x:514, y:520},
			{x:486, y:541},
			{x:455, y:563},
			{x:434, y:534},
			{x:413, y:503},
			{x:392, y:475},
			{x:370, y:446},
			{x:349, y:415},
			{x:299, y:417},
			{x:277, y:445},
			{x:258, y:474},
			{x:235, y:504},
			{x:215, y:534},
			{x:192, y:563},
			{x:164, y:541},
			{x:133, y:520},
			{x:156, y:492},
			{x:177, y:461},
			{x:198, y:431},
			{x:218, y:403},
			{x:240, y:374},
			{x:224, y:325},
			{x:190, y:315},
			{x:156, y:304},
			{x:123, y:293},
			{x:88, y:282},
			{x:53, y:271},
			{x:63, y:237},
			{x:75, y:201},
			{x:108, y:213},
			{x:144, y:224},
			{x:177, y:235},
			{x:212, y:246},
			{x:247, y:258},
			{x:288, y:228},
			{x:288, y:192},
			{x:289, y:156},
			{x:289, y:118},
			{x:289, y:82},
			{x:288, y:47},
			{x:325, y:47},
			{x:361, y:48},
			{x:362, y:82},
			{x:360, y:121},
			{x:360, y:156},
			{x:360, y:229},
			{x:401, y:257},
			{x:436, y:246},
			{x:469, y:235},
			{x:504, y:223},
			{x:538, y:212},
			{x:572, y:200},
			{x:583, y:235},
			{x:596, y:271},
			{x:562, y:282},
			{x:525, y:292},
			{x:491, y:304},
			{x:458, y:314},
			{x:423, y:326},

		],
		players:[
			{
				startIndex:8,
				homdeIndex:6,
				saveIndex:16,
				startPos:[
					{x:325, y:488, scale:1},
					{x:324, y:526, scale:1},
					{x:288, y:541, scale:1},
					{x:361, y:543, scale:1},

				],
				homePos:[
					{x:337, y:382, scale:0.8},
					{x:353, y:370, scale:0.8},
					{x:369, y:360, scale:0.8},
					{x:386, y:350, scale:0.8},

				],
				homePath:[
					{x:464, y:511},
					{x:441, y:481},
					{x:421, y:452},
					{x:399, y:424},
					{x:378, y:394},

				],
				name:{
					x:325,
					y:610,
					fontSize:22,
					align:'center',
					color:'#000',
					rotation:0,
				},
				status:{
					x:325,
					y:585,
					fontSize:18,
					align:'center',
					color:'#000',
					rotation:0,
				},
				shape:[
					{x:198, y:615},
					{x:168, y:565},
					{x:295, y:392},
					{x:324, y:413},
					{x:323, y:318},
					{x:412, y:350},
					{x:383, y:369},
					{x:511, y:545},
					{x:465, y:615},
					{x:198, y:615},

				],
			},

			{
				startIndex:21,
				homdeIndex:19,
				saveIndex:29,
				startPos:[
					{x:103, y:354, scale:1},
					{x:129, y:384, scale:1},
					{x:126, y:423, scale:1},
					{x:165, y:373, scale:1},

				],
				homePos:[
					{x:262, y:351, scale:0.8},
					{x:278, y:361, scale:0.8},
					{x:294, y:372, scale:0.8},
					{x:311, y:386, scale:0.8},

				],
				homePath:[
					{x:184, y:514},
					{x:206, y:483},
					{x:226, y:454},
					{x:248, y:423},
					{x:269, y:394},

				],
				name:{
					x:50,
					y:410,
					fontSize:22,
					align:'center',
					color:'#000',
					rotation:72,
				},
				status:{
					x:76,
					y:405,
					fontSize:18,
					align:'center',
					color:'#000',
					rotation:72,
				},
				shape:[
					{x:42, y:247},
					{x:31, y:282},
					{x:5, y:290},
					{x:87, y:547},
					{x:166, y:565},
					{x:295, y:392},
					{x:324, y:412},
					{x:325, y:317},
					{x:237, y:347},
					{x:247, y:315},

				],
			},

			{
				startIndex:34,
				homdeIndex:32,
				saveIndex:42,
				startPos:[
					{x:165, y:163, scale:1},
					{x:226, y:185, scale:1},
					{x:204, y:154, scale:1},
					{x:224, y:121, scale:1},

				],
				homePos:[
					{x:257, y:329, scale:0.8},
					{x:265, y:309, scale:0.8},
					{x:274, y:292, scale:0.8},
					{x:279, y:275, scale:0.8},

				],
				homePath:[
					{x:99, y:247},
					{x:133, y:258},
					{x:167, y:269},
					{x:202, y:280},
					{x:237, y:292},

				],
				name:{
					x:163,
					y:101,
					fontSize:22,
					align:'center',
					color:'#000',
					rotation:-37,
				},
				status:{
					x:175,
					y:122,
					fontSize:18,
					align:'center',
					color:'#000',
					rotation:-36,
				},
				shape:[
					{x:306, y:245},
					{x:306, y:28},
					{x:270, y:31},
					{x:255, y:9},
					{x:38, y:165},
					{x:43, y:248},
					{x:248, y:316},
					{x:238, y:348},
					{x:324, y:316},
					{x:270, y:242},

				],
			},

			{
				startIndex:47,
				homdeIndex:45,
				saveIndex:54,
				startPos:[
					{x:424, y:183, scale:1},
					{x:485, y:162, scale:1},
					{x:446, y:154, scale:1},
					{x:425, y:119, scale:1},

				],
				homePos:[
					{x:352, y:262, scale:0.8},
					{x:334, y:262, scale:0.8},
					{x:318, y:262, scale:0.8},
					{x:298, y:263, scale:0.8},

				],
				homePath:[
					{x:325, y:83},
					{x:325, y:120},
					{x:325, y:157},
					{x:325, y:191},
					{x:325, y:228},

				],
				name:{
					x:483,
					y:100,
					fontSize:22,
					align:'center',
					color:'#000',
					rotation:37,
				},
				status:{
					x:471,
					y:120,
					fontSize:18,
					align:'center',
					color:'#000',
					rotation:36,
				},
				shape:[
					{x:597, y:214},
					{x:390, y:281},
					{x:378, y:247},
					{x:326, y:313},
					{x:270, y:248},
					{x:307, y:245},
					{x:306, y:29},
					{x:385, y:0},
					{x:601, y:157},
					{x:586, y:179},

				],
			},

			{
				startIndex:59,
				homdeIndex:57,
				saveIndex:3,
				startPos:[
					{x:483, y:372, scale:1},
					{x:522, y:385, scale:1},
					{x:523, y:422, scale:1},
					{x:546, y:355, scale:1},

				],
				homePos:[
					{x:390, y:330, scale:0.8},
					{x:384, y:312, scale:0.8},
					{x:375, y:274, scale:0.8},
					{x:380, y:294, scale:0.8},

				],
				homePath:[
					{x:550, y:249},
					{x:514, y:258},
					{x:480, y:269},
					{x:447, y:280},
					{x:412, y:290},

				],
				name:{
					x:600,
					y:410,
					fontSize:22,
					align:'center',
					color:'#000',
					rotation:-72,
				},
				status:{
					x:574,
					y:407,
					fontSize:18,
					align:'center',
					color:'#000',
					rotation:-72,
				},
				shape:[
					{x:383, y:368},
					{x:411, y:348},
					{x:325, y:321},
					{x:379, y:247},
					{x:390, y:282},
					{x:594, y:212},
					{x:647, y:279},
					{x:566, y:531},
					{x:538, y:525},
					{x:508, y:545},

				],
			},


		],
	},

	{
		image:'assets/board3.png',
		scale:'0.9',
		dice:{
			x:348,
			y:330,
		},
		paths:[
			{x:436, y:416},
			{x:455, y:449},
			{x:471, y:479},
			{x:491, y:511},
			{x:510, y:543},
			{x:526, y:574},
			{x:495, y:591},
			{x:463, y:611},
			{x:444, y:578},
			{x:427, y:546},
			{x:408, y:515},
			{x:391, y:484},
			{x:374, y:453},
			{x:324, y:453},
			{x:306, y:486},
			{x:287, y:516},
			{x:271, y:547},
			{x:251, y:579},
			{x:232, y:610},
			{x:201, y:591},
			{x:170, y:573},
			{x:189, y:544},
			{x:207, y:511},
			{x:225, y:478},
			{x:242, y:448},
			{x:261, y:416},
			{x:236, y:374},
			{x:200, y:375},
			{x:163, y:375},
			{x:127, y:374},
			{x:91, y:374},
			{x:55, y:373},
			{x:56, y:337},
			{x:55, y:302},
			{x:91, y:302},
			{x:127, y:302},
			{x:163, y:303},
			{x:199, y:302},
			{x:237, y:302},
			{x:261, y:258},
			{x:243, y:225},
			{x:224, y:195},
			{x:206, y:165},
			{x:188, y:132},
			{x:171, y:101},
			{x:202, y:84},
			{x:234, y:66},
			{x:253, y:97},
			{x:271, y:128},
			{x:289, y:159},
			{x:306, y:190},
			{x:324, y:223},
			{x:371, y:222},
			{x:389, y:191},
			{x:408, y:159},
			{x:427, y:130},
			{x:446, y:97},
			{x:463, y:67},
			{x:495, y:84},
			{x:527, y:103},
			{x:508, y:135},
			{x:490, y:166},
			{x:471, y:198},
			{x:454, y:228},
			{x:435, y:259},
			{x:462, y:302},
			{x:497, y:302},
			{x:533, y:300},
			{x:570, y:300},
			{x:605, y:301},
			{x:643, y:302},
			{x:643, y:338},
			{x:642, y:376},
			{x:604, y:374},
			{x:567, y:374},
			{x:533, y:373},
			{x:495, y:374},
			{x:462, y:374},

		],
		players:[
			{
				startIndex:8,
				homdeIndex:6,
				saveIndex:16,
				startPos:[
					{x:317, y:583, scale:1},
					{x:348, y:528, scale:1},
					{x:349, y:565, scale:1},
					{x:378, y:583, scale:1},

				],
				homePos:[
					{x:372, y:411, scale:0.8},
					{x:398, y:399, scale:0.8},
					{x:364, y:386, scale:0.8},
					{x:386, y:377, scale:0.8},

				],
				homePath:[
					{x:478, y:560},
					{x:458, y:528},
					{x:442, y:497},
					{x:423, y:464},
					{x:405, y:434},

				],
				name:{
					x:349,
					y:660,
					fontSize:25,
					align:'center',
					color:'#000',
					rotation:0,
				},
				status:{
					x:349,
					y:625,
					fontSize:18,
					align:'center',
					color:'#000',
					rotation:0,
				},
				shape:[
					{x:240, y:673},
					{x:240, y:634},
					{x:208, y:614},
					{x:317, y:429},
					{x:348, y:447},
					{x:347, y:336},
					{x:441, y:391},
					{x:411, y:410},
					{x:521, y:597},
					{x:459, y:633},
					{x:457, y:673},
					{x:242, y:673},

				],
			},

			{
				startIndex:21,
				homdeIndex:19,
				saveIndex:29,
				startPos:[
					{x:120, y:433, scale:1},
					{x:184, y:432, scale:1},
					{x:152, y:452, scale:1},
					{x:152, y:485, scale:1},

				],
				homePos:[
					{x:326, y:393, scale:0.8},
					{x:309, y:379, scale:0.8},
					{x:317, y:413, scale:0.8},
					{x:295, y:397, scale:0.8},

				],
				homePath:[
					{x:218, y:562},
					{x:238, y:529},
					{x:256, y:497},
					{x:274, y:466},
					{x:293, y:436},

				],
				name:{
					x:68,
					y:498,
					fontSize:25,
					align:'center',
					color:'#000',
					rotation:60,
				},
				status:{
					x:97,
					y:480,
					fontSize:18,
					align:'center',
					color:'#000',
					rotation:60,
				},
				shape:[
					{x:111, y:597},
					{x:146, y:578},
					{x:208, y:615},
					{x:318, y:429},
					{x:347, y:445},
					{x:349, y:336},
					{x:255, y:391},
					{x:253, y:353},
					{x:36, y:355},
					{x:38, y:390},
					{x:3, y:409},

				],
			},

			{
				startIndex:34,
				homdeIndex:32,
				saveIndex:42,
				startPos:[
					{x:152, y:224, scale:1},
					{x:152, y:186, scale:1},
					{x:121, y:241, scale:1},
					{x:185, y:241, scale:1},

				],
				homePos:[
					{x:269, y:353, scale:0.8},
					{x:270, y:320, scale:0.8},
					{x:294, y:351, scale:0.8},
					{x:293, y:325, scale:0.8},

				],
				homePath:[
					{x:92, y:337},
					{x:127, y:337},
					{x:164, y:336},
					{x:200, y:338},
					{x:238, y:338},

				],
				name:{
					x:86,
					y:179,
					fontSize:25,
					align:'center',
					color:'#000',
					rotation:-60,
				},
				status:{
					x:112,
					y:200,
					fontSize:18,
					align:'center',
					color:'#000',
					rotation:-60,
				},
				shape:[
					{x:4, y:263},
					{x:37, y:284},
					{x:38, y:357},
					{x:254, y:357},
					{x:253, y:392},
					{x:347, y:337},
					{x:254, y:282},
					{x:286, y:264},
					{x:179, y:78},
					{x:145, y:97},
					{x:110, y:75},
					{x:3, y:263},

				],
			},

			{
				startIndex:47,
				homdeIndex:45,
				saveIndex:55,
				startPos:[
					{x:319, y:92, scale:1},
					{x:348, y:145, scale:1},
					{x:348, y:109, scale:1},
					{x:380, y:92, scale:1},

				],
				homePos:[
					{x:294, y:277, scale:0.8},
					{x:322, y:262, scale:0.8},
					{x:307, y:293, scale:0.8},
					{x:329, y:284, scale:0.8},

				],
				homePath:[
					{x:220, y:114},
					{x:238, y:146},
					{x:257, y:177},
					{x:275, y:209},
					{x:292, y:240},

				],
				name:{
					x:349,
					y:32,
					fontSize:25,
					align:'center',
					color:'#000',
					rotation:0,
				},
				status:{
					x:349,
					y:62,
					fontSize:18,
					align:'center',
					color:'#000',
					rotation:0,
				},
				shape:[
					{x:242, y:1},
					{x:241, y:40},
					{x:177, y:78},
					{x:286, y:263},
					{x:254, y:283},
					{x:347, y:336},
					{x:349, y:230},
					{x:379, y:245},
					{x:489, y:58},
					{x:455, y:40},
					{x:455, y:0},
					{x:243, y:2},

				],
			},

			{
				startIndex:60,
				homdeIndex:58,
				saveIndex:68,
				startPos:[
					{x:515, y:242, scale:1},
					{x:546, y:222, scale:1},
					{x:546, y:189, scale:1},
					{x:577, y:241, scale:1},

				],
				homePos:[
					{x:373, y:262, scale:0.8},
					{x:402, y:274, scale:0.8},
					{x:365, y:282, scale:0.8},
					{x:389, y:292, scale:0.8},

				],
				homePath:[
					{x:478, y:115},
					{x:458, y:148},
					{x:441, y:177},
					{x:422, y:211},
					{x:404, y:242},

				],
				name:{
					x:613,
					y:185,
					fontSize:25,
					align:'center',
					color:'#000',
					rotation:60,
				},
				status:{
					x:583,
					y:200,
					fontSize:18,
					align:'center',
					color:'#000',
					rotation:60,
				},
				shape:[
					{x:587, y:78},
					{x:550, y:97},
					{x:487, y:59},
					{x:381, y:246},
					{x:349, y:229},
					{x:346, y:337},
					{x:443, y:282},
					{x:442, y:318},
					{x:659, y:320},
					{x:660, y:282},
					{x:693, y:262},
					{x:588, y:79},

				],
			},

			{
				startIndex:73,
				homdeIndex:71,
				saveIndex:3,
				startPos:[
					{x:514, y:434, scale:1},
					{x:547, y:451, scale:1},
					{x:547, y:489, scale:1},
					{x:575, y:435, scale:1},

				],
				homePos:[
					{x:427, y:354, scale:0.8},
					{x:428, y:322, scale:0.8},
					{x:401, y:327, scale:0.8},
					{x:401, y:349, scale:0.8},

				],
				homePath:[
					{x:606, y:337},
					{x:569, y:338},
					{x:534, y:338},
					{x:497, y:338},
					{x:459, y:338},

				],
				name:{
					x:628,
					y:500,
					fontSize:25,
					align:'center',
					color:'#000',
					rotation:-60,
				},
				status:{
					x:597,
					y:483,
					fontSize:18,
					align:'center',
					color:'#000',
					rotation:-60,
				},
				shape:[
					{x:692, y:411},
					{x:659, y:392},
					{x:659, y:318},
					{x:443, y:317},
					{x:443, y:283},
					{x:348, y:336},
					{x:442, y:392},
					{x:411, y:409},
					{x:520, y:598},
					{x:553, y:577},
					{x:586, y:598},
					{x:691, y:413},

				],
			},


		],
	},

	];