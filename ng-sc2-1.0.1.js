// Nocturnal Gamers - SC2 Rankings
// Author: Carl Corbeil
// Date: March 2016
// Version: 1.0.1

// GM : 100, Master : 90, Diamond 80, etc.

// Strings
var APIKEY = '9bpn333s2r7q7ejs573d9hc8cfkrdkp3';

var BNET_PROFILE = 'https://us.api.battle.net/sc2/profile/@ID@/1/@NAME@/ladders?locale=en_US&apikey='+APIKEY;
var BNET_LADDER = 'https://us.api.battle.net/sc2/ladder/@ID@?locale=en_US&apikey='+APIKEY;

var KEY_RANKS_STORAGE = 'WARSHOP@@!!NGRANKS12';
var KEY_DATE_STORAGE = 'WARSHOP@@369!!NGDATE';

var LeagueIDs = {
   "GRANDMASTER": 100,
   "MASTER":      90,
   "DIAMOND":     80,
   /*"PLATINUM":    70,
   "GOLD":        60,
   "SILVER":      50,
   "BRONZE":      40,*/
};

function Player(id, name, displayName) {
   this.ID = id; this.Name = name; this.DiplayName = displayName; this.Wins = 0; this.Losses = 0;
   this.Division = { ID: 0, Rank: 0, League: 'Unranked', LeagueID : -1, };
   this.Points = 0; this.Profile = ''; this.Winrate = 0; this.Race = ''; this.Updated = false;
};

Player.prototype.edit = function(divId, rank, league, wins, losses, profile) {
   this.Division.ID = divId;
   this.Division.Rank = rank;
   this.Division.League = league;
   this.Wins = wins;
   this.Losses = losses;
   this.Winrate = (wins / (wins + losses) * 100).toFixed(2);
   this.Profile = profile;
   if (typeof LeagueIDs[league.toUpperCase()] != 'undefined') {
      this.Division.LeagueID = LeagueIDs[league.toUpperCase()];
   }
};

Player.prototype.ladder = function(points, race) {
   this.Points = points;
   console.log(points);
   
   if (race) { // can be null.
      this.Race = race;
   }
};

Player.prototype.isActive = function() {
   if (this.Wins == 0 && this.Losses == 0 && this.Division.Rank == 0) {
      // No longer in the division. Show as inactive.
      this.Division.Rank = "-";
      this.Points = "-";
      this.Winrate = "-";
      this.Wins = "-";
      this.Losses = "-";
      
      return false;
   }
   
   return true;
};

var Players = {
   data: [],
   forEach: function(callback) {
      this.data.forEach(callback);
   },
   add: function(id, name, displayName) {
      this.data.push(new Player(id, name, displayName));
   },
   addPlayer: function(player) {
      this.data.push(player);
   },
   next: function(i) {
      return this.data[i];
   },
   get length() {
      return this.data.length;
   },
};

Players.add(603458, 'ZenedoR', 'ZenedoR');
Players.add(877695, 'Warshop', 'Warshop');
Players.add(684195, 'PraetorFenix', 'PraetorFenix');
Players.add(2782310, 'eKimRoss', 'eKimRoss'); // MikeRoss
Players.add(272859, 'ShuriCMoi', 'ShuriCMoi'); // ShuriKn
Players.add(443514, 'desRow', 'desRow');
Players.add(1523692, 'Spynol', 'Spynol');
Players.add(4180857, 'Xion', 'Xion');
Players.add(4239642, 'FiNiTiON', 'FiNiTiON');
Players.add(2463425, 'JuGGeRNutZ', 'JuGGeRNutZ'); // MammaMia
Players.add(2220414, 'DieZaCRo', 'DieZaCRo');
Players.add(4630475, 'Epoks', 'Epoks'); // Spoke
Players.add(4165803, 'Jig', 'Jig');
Players.add(753085, 'Grincheux', 'Grincheux'); // Vlare
Players.add(2768457, 'Geeden', 'Geeden');
Players.add(403486, 'InSTinK', 'InSTinK');
Players.add(4023345, 'Zepish', 'Zepish');
Players.add(529205, 'SpiZe', 'SpiZe');
Players.add(1609478, 'Tiger', 'Tiger');
Players.add(438533, 'Adonisto', 'Adonisto');
Players.add(1052655, 'Marthy', 'Marthy');
Players.add(401741, 'DeathRow', 'DeathRow');
Players.add(403065, 'MammouthQc', 'MammouthQc');
Players.add(6208868, 'Chobo', 'Chobo'); // ShuriKn #2
Players.add(1123653, 'nGYepp', 'nGYepp');
Players.add(909257, 'crBox', 'crBox');
Players.add(3537564, 'Sky', 'Sky');
Players.add(4179800, 'Vesuvius', 'Vesuvius'); // PraetorFenix #2
Players.add(0, 'PraeEZfenix', ''); // Who?
Players.add(543646, 'LeRoiduNord', 'LeRoiduNord'); // LeGosu
Players.add(532777, 'HazikaN', 'HazikaN');
Players.add(807920, 'ManGeMaGrAiN', 'ManGeMaGrAiN'); // MammaMia #2
Players.add(295201, 'Names', 'Names');
Players.add(0, 'BanDAiD', 'BanDAiD');
      
function editPlayer(li, profile, playerId, redrawFn) {
   var found = false, ladderId = 0;
   for (i = 0; i < Players.length && !found; ++i) {
      var p = Players.next(i);
      if (p.ID == playerId) {
         p.edit(li.ladderId, li.rank, li.league, li.wins, li.losses, profile);
         ladderId = li.ladderId;
         found = true;
         
         if (!p.isActive() && !p.Updated) {
            redrawFn(p);
            p.Updated = true;
         }
      }
   }
   
   return ladderId;
};
      
function editPoints(cc, playerId, redrawFn) {
   var found = false;
   for (var i = 0; i < Players.length && !found; ++i) {
      var p = Players.next(i);
      if (p.ID == playerId) {
         p.ladder(cc.points, cc.favoriteRaceP1);
         found = true;
         
         if (!p.Updated) {
            redrawFn(p);
            p.Updated = true;
            sessionStorage[KEY_RANKS_STORAGE] = JSON.stringify(Players); //Store locally.
         }
      }
   }
}
  
$(document).ready(function () {
   var table = $('#tbPlayers').DataTable({
      "searching": false,
      "paging": false,
      "ordering": true,
      "data": null,
      "columns": [
         { "data": "Division.LeagueID" },
         { "data": "Division.League" },
         { "data": "Race" },
         { "data": "Division.Rank" },
         { "data": "Points" },
         { "data": "Name" },
         { "data": "Wins" },
         { "data": "Losses" },
         { "data": "Winrate" },
         { "data": "Profile" },
      ],
      "columnDefs": [
         {
            "targets": 0,
            "render": function (data, type, full, meta) {
               return "<small style='font-size:10px'>" + data + "</small>";
            },
            "orderable": true,
         },
         {
            "targets": 1,
            "render": function (data, type, full, meta) {
               if (typeof LeagueIDs[data.toUpperCase()] != 'undefined') {
                  return "<img src='img/"+data.toLowerCase()+".png' class='img-sc2' alt='1'></img>";
               } else {
                  return "-";
               }
            },
            "orderable": false,
         },
         {
            "targets": 3,
            "render": function (data, type, full, meta) {
               return data == 1 ? '1st' : data == 2 ? '2nd' : data == 3 ? '3rd' : data == '-' ? '-' : data + 'th';
            },
         },
         {
            "targets": 2,
            "render": function (data, type, full, meta) {
               if (data) {
                  return "<img src='img/"+data.toLowerCase()+".png' class='img-sc2'></img>";
               } else {
                  return data;
               }
            },
            "orderable": false,
         },
         {
            "targets": 5,
            "orderable": false,
         },
         {
            "targets": 9,
            "render": function ( data, type, full, meta ) {
               return "<a href='http://us.battle.net/sc2/en"+data+"'>Profile</a>";
            },
            "orderable": false,
         }
      ],
      "createdRow": function (row, data, dataIndex) {
         var selectedPlayer = location.hash;
         if (selectedPlayer) {
            selectedPlayer = selectedPlayer.replace("#", "");
            if (data.Name.toLowerCase() == selectedPlayer.toLowerCase()) {
               $(row).addClass("selection");
            }
         }
         
         $(row).on("click", function() {
            $(".selection").removeClass("selection");
            $(this).addClass("selection");
            location.hash = table.row(this).data().Name;
         });
      },
   });

   var fetch = function() {
      getLatest(table);
      sessionStorage[KEY_DATE_STORAGE] = moment().format();
      $('#lastUpdate').text(moment().format('MMMM Do YYYY, h:mm:ss a'));
   };
   
   var dStored = sessionStorage[KEY_DATE_STORAGE];
   if (dStored) {
      if (moment(dStored).isBefore(moment().subtract(5, 'minutes'))) {
         fetch();
      } else {
         drawFromStorage(JSON.parse(sessionStorage[KEY_RANKS_STORAGE]), table);
         $('#lastUpdate').text(moment(dStored).format('MMMM Do YYYY, h:mm:ss a'));
      }
   } else {
      fetch();
   }
});

function drawFromStorage(players, table) {
   players.data.forEach(function(p) {
      Players.add(p);
      if (p.Updated) {
         table.row.add(p).order([0, 'desc'], [4, 'desc']).draw();
      }
   });
};

function getLatest(table) {
   for (var i = 0; i < Players.length; ++i) {
      var p = Players.next(i);
      if (p.ID > 0) {
         $.ajax({
            url: BNET_PROFILE.replace("@ID@", p.ID).replace("@NAME@", p.Name),
         }).done( function(resp) {
            for (var j = 0; j < resp.currentSeason.length; ++j) {
               var li = resp.currentSeason[j].ladder[0];
               if (li && li.matchMakingQueue == "LOTV_SOLO") {
                  var ladderId = editPlayer(li, resp.currentSeason[j].characters[0].profilePath, resp.currentSeason[j].characters[0].id, function (player) {
                     table.row.add(player).order([0, 'desc'], [4, 'desc']).draw();
                  });
                  $.ajax({
                     url: BNET_LADDER.replace("@ID@", ladderId),
                  }).done( function(resp2) {
                     for (var k = 0; k < resp2.ladderMembers.length; ++k) {
                        editPoints(resp2.ladderMembers[k], resp2.ladderMembers[k].character.id,  function (player) {
                           table.row.add(player).order([0, 'desc'], [4, 'desc']).draw();
                        });
                     }
                  });
               }
            }
         });
      }
   }
};