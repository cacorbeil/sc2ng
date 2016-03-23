// Nocturnal Gamers - SC2 Rankings
// Author: Carl Corbeil
// Date: March 2016
// Version: 1.0.5

// GM : 100, Master : 90, Diamond 80, etc.

// Strings
var APIKEY = '9bpn333s2r7q7ejs573d9hc8cfkrdkp3';

var BNET_PROFILE = 'https://us.api.battle.net/sc2/profile/@ID@/1/@NAME@/ladders?locale=en_US&apikey='+APIKEY;
var BNET_LADDER = 'https://us.api.battle.net/sc2/ladder/@ID@?locale=en_US&apikey='+APIKEY;
var BNET_BONUSPOOL = '/@ID@/1/@NAME@/ladder/@LADDERID@';
//var BNET_BONUSPOOL = 'http://us.battle.net/sc2/en/profile/@ID@/1/@NAME@/ladder/@LADDERID@';

var KEY_RANKS_STORAGE = 'WARSHOP@@!!NGRANKS105';
var KEY_DATE_STORAGE = 'WARSHOP@@105!!NGDATE';

$.fn.dataTable.ext.errMode = 'throw'; // It uses alerts otherwise. Not very nice for users!

var LeagueIDs = {
   "GRANDMASTER": 100,
   "MASTER":      90,
   "DIAMOND":     80,
   /*"PLATINUM":    70,
   "GOLD":        60,
   "SILVER":      50,
   "BRONZE":      40,*/
};

function GetLeagueById(id) {
   for (k in LeagueIDs) {
      if (LeagueIDs[k] == id) {
         return k;
      }
   }
   
   return null;
};

function Player(id, name, displayName) {
   this.ID = id; this.Name = name; this.DiplayName = displayName; this.Wins = 0; this.Losses = 0;
   this.Division = { ID: 0, Rank: 0, League: 'Unranked', LeagueID : -1, };
   this.Points = 0; this.Profile = ''; this.Winrate = 0; this.Race = ''; this.Updated = false;
   this.BonusPool = -1; this.BonusDate = null; this.hMMR = { Value: 0, PlusMinus: 0, };
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
   clear: function() {
      this.data = [];
   },
   count: function() {
      return this.data.length;
   },
   countUpdated: function() {
      var count = 0;
      for(var i = 0; i < this.data.length; ++i) {
         if (this.data[i].Updated)
            count++;
      }
      return count;
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
         
         var selected = playerSelected();
         if (selected == p.Name) {
            $
         }
         
         if (!p.Updated) {
            redrawFn(p);
            p.Updated = true;
            sessionStorage[KEY_RANKS_STORAGE] = JSON.stringify(Players); //Store locally.
         }
      }
   }
};

function playerSelected() {
   var selectedPlayer = location.hash;
   if (selectedPlayer) {
      return selectedPlayer.replace("#", "");
   } else {
      return null;
   }
};
  
$(document).ready(function () {
   var table = $('#tbPlayers').DataTable({
      "orderFixed": [0, 'desc'],
      "searching": false,
      "paging": false,
      "ordering": true,
      "data": null,
      "info": false,
      "language": {
         "emptyTable": "Loading data... Please be patient."
       },
      "columns": [
         { "data": "Division.LeagueID" },
         { "data": "Race" },
         { "data": "Division.Rank" },
         { "data": "Points" },
         { "data": "Name" },
         { "data": "Wins" },
         { "data": "Losses" },
         { "data": "Winrate" },
         { "data": "Profile" },
         { "data": "BonusPool"},
         { "data": "hMMR" },
      ],
      "columnDefs": [
         {
            "targets": 0,
            "render": function (data, type, full, meta) {
               if (type == "display") {
                  var ls = GetLeagueById(data);
                  if (ls != null) {
                     return "<img src='img/"+ls.toLowerCase()+".png' class='img-sc2' alt='1'></img>";
                  } else {
                     return "-";
                  }
               }
               
               return data;
            },
            "orderable": false,
         },
         {
            "targets": 1,
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
            "targets": 2,
            "render": function (data, type, full, meta) {
               return data == 1 ? '1st' : data == 2 ? '2nd' : data == 3 ? '3rd' : data == '-' ? '-' : data + 'th';
            },
         },
         {
            "targets": 4,
            "orderable": false,
         },
         {
            "targets": 8,
            "render": function ( data, type, full, meta ) {
               return "<a href='http://us.battle.net/sc2/en"+data+"'>Profile</a>";
            },
            "orderable": false,
         },
         {
            "targets": 9,
            "render": function ( data, type, full, meta ) {
               if (data < 0) {
                  return '<i class="fa fa-spinner fa-pulse"></i>';
               } else {
                  return data;
               }
            },
         },
         {
            "targets": 10,
            "render": function ( data, type, full, meta ) {
               if (type == "display") {
                  if (data.PlusMinus > 0) {
                     var pColor = "#d9534f";
                     var pText = "";
                     if (data.PlusMinus > data.Value) {
                        pColor = "#5cb85c";
                        pText = "+";
                     }
                     return "<span title='Points + (BonusPool * 2 * Winrate)'>" + data.Value + "</span>" +
                     " <span style='color:"+pColor+"' title='50% winrate'><small>("+pText+(data.PlusMinus-data.Value)+")</small></span>";
                  } else {
                     return "<span title='formula: Points + (BonusPool * 2 * Winrate)'>" + data.Value + "</span>";
                  }
               }
               
               return data.Value;
            },
         },
      ],
      "createdRow": function (row, data, dataIndex) {
         var selected = playerSelected();
         if (selected) {
            if (data.Name.toLowerCase() == selected.toLowerCase()) {
               $(row).addClass("selection");
            }
         }
         
         $(row).on("click", function() {
            $(".selection").removeClass("selection");
            $(this).addClass("selection");
            var p = table.row(this).data();
            location.hash = p.Name;
            /*$.ajax({
               url: 'bonus.php',
               type: 'POST',
               data: {
                  address: BNET_BONUSPOOL.replace("@ID@", p.ID).replace("@NAME@", p.Name).replace("@LADDERID@", p.Division.ID)
               },
               success:  function (response) {
                  p.BonusPool = $(response).find('#bonus-pool').children('span').html();
                  p.Updated = true;
                  table.row(dataIndex).data(p).draw();
                  sessionStorage[KEY_RANKS_STORAGE] = JSON.stringify(Players); //Store locally.
               },
            });*/
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
   Players.clear();
   players.data.forEach(function(p) {
      Players.addPlayer(p);
      if (p.Updated) {
         table.row.add(p).order([3, 'desc']).draw();
         $('#nbPlayers').text('Showing ' + Players.countUpdated() + ' ranked players. ' + (Players.count() - Players.countUpdated()) + ' players are unranked.');
      }
   });
};

function drawPlayer(p, table) {
   var rowIndex = table.row.add(p).order([3, 'desc']).draw().index();
   $('#nbPlayers').text('Showing ' + Players.countUpdated() + ' ranked players. ' + (Players.count() - Players.countUpdated()) + ' players are unranked.');
   
   var getBonusPool = function() {
      $.ajax({
         url: 'bonus.php',
         type: 'POST',
         data: {
            address: BNET_BONUSPOOL.replace("@ID@", p.ID).replace("@NAME@", p.Name).replace("@LADDERID@", p.Division.ID)
         },
         success:  function (response) {
            var bonusPoolNode = $(response).find('#bonus-pool');
            if (bonusPoolNode.length > 0) {
               p.BonusPool = bonusPoolNode.children('span').html();
               p.hMMR.Value = (p.Points + (p.BonusPool * 2 * (p.Winrate / 100))).toFixed(0);
               p.hMMR.PlusMinus = (p.Points + (p.BonusPool * 2 * 0.5)).toFixed(0); // 50% Winrate
            } else {
               p.BonusPool = 0;
               p.hMMR.Value = p.Points;
            }
            
            p.Updated = true;
            p.BonusDate = moment().format();
            table.row(rowIndex).data(p).draw();
            sessionStorage[KEY_RANKS_STORAGE] = JSON.stringify(Players); //Store locally.
         },
      });
   };
   
   // This shit doesn't work. Every 5 minutes, Players are recreated. RIP.
   if (!p.BonusDate) {
      // BonusPool was not updated. Update it!
      getBonusPool();
   } else {
      // Only update bonus pool each 30 minutes
      if (moment(p.BonusDate).isBefore(moment().subtract(30, 'minutes'))) {
         getBonusPool();
      }
   }
}

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
                     drawPlayer(player, table);
                  });
                  $.ajax({
                     url: BNET_LADDER.replace("@ID@", ladderId),
                  }).done( function(resp2) {
                     for (var k = 0; k < resp2.ladderMembers.length; ++k) {
                        editPoints(resp2.ladderMembers[k], resp2.ladderMembers[k].character.id,  function (player) {
                           drawPlayer(player, table);
                        });
                     }
                  });
               }
            }
         });
      }
   }
};