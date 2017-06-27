var app = angular.module("seriesList", []);
app.controller("seriesController", function($scope, imdbAPI){

  $scope.series = [];
  $scope.mySeries = [];
  $scope.watchList = [];

  $scope.pesquisou = "";


  $scope.hasNoThumbnail = function(serie){
  	 if(serie.Poster == 'N/A') {
  	 	return true;
  	 }else{
     	return false;
     } 
 }

   $scope.getSeries = function(nome){
    $scope.series = [];
    $scope.pesquisou = "";
		var promise = imdbAPI.getSeriesFromAPI(nome);
    promise.then(function(response){
      if(response.data.Response == "True"){
          $scope.series = response.data.Search;
      }else{
      	  $scope.pesquisou = response.data.Error;  
      };

		}, function error(response){
			console.log("Erro");
		})
		return promise;
	};

   $scope.setMyGrade = function(grade, serie){
    serie.nota = grade;
  }

  $scope.setLastEp = function(ultimoEpi, serie){
    serie.ultimoEpi = ultimoEpi;
  }

  $scope.pesquisa = function(){
    return $scope.pesquisou == "Movie not found!";
  }

  $scope.containsMySeries = function(serie){
    return contains($scope.mySeries, serie);
  };

  $scope.containsWatchList = function(serie){
    return contains($scope.watchList, serie);
  };

  var contains = function(array, serie){
    for (var i = 0; i < array.length; i++) {
      if (array[i].imdbID == serie.imdbID){
        return true;
      }
    }return false;
  }

  $scope.addToProfile = function(serie){
    if ($scope.containsMySeries(serie)){
      alert("Você já adicionou " + serie.Title + " ao seu perfil.");
    }else{
      var promise = imdbAPI.getFullSerieFromAPI(serie);
      promise.then(function(response){
        var completa = response.data;
        $scope.mySeries.push(completa);
        alert(serie.Title + " adicionado(a) ao seu perfil.")
      }).catch(function(error){
        console.log(error);
      });
    };

    if (contains($scope.watchList, serie)){
      var index = $scope.watchList.indexOf(serie);
      $scope.watchList.splice(index, 1);
    }
  };

  $scope.addToWatchlist = function(serie){
    if (contains($scope.mySeries, serie)){
      alert("Você já possui essa série no seu perfil.");
    }else{
      if (!contains($scope.watchList, serie)){
        $scope.watchList.push(serie);
        alert(serie.Title + " adicionada a sua WatchList")
      }else{
        alert("Você já adicionou " + serie.Title + " a sua WatchList");
      }
    }
  }

    $scope.deleteSerie = function(serie){
    var index = $scope.mySeries.indexOf(serie);
    decisao = confirm("Deseja excluir a série " + serie.Title + " do seu perfil?");
    if (decisao){
      if (index > -1){
        $scope.mySeries.splice(index, 1);
      }
      alert ("A série "+serie.Title+" foi excluída do seu perfil");
    }
  }

});
