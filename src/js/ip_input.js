angular.module('ng-ip-input', []).directive('ngIpv4', function() {
    var backup = function(value) {
        var input = this;
        if (index !== undefined) {
            input.prevValues = value;
        } else {
            throw new Error('backup error');
        }
    };

    var revert = function(cells, prevValue) {
        prevValue.split('.').forEach(function(value, index) {
            if (index > 4) throw new Error('index more than 4');
            angular.element(cells[index]).val(value);
        });
    };

    var selectCell = function(index) {
        var input = this;
        if (index === undefined || index < 0 || index > 3) return;
        input.find("input")[index].select();
    };

    var isValidIPStr = function(ipString) {
        if (typeof ipString !== 'string') return false;

        var ipStrArray = ipString.split('.');
        if (ipStrArray.length !== 4) return false;

        return ipStrArray.reduce(function(prev, cur) {
            if (prev === false || cur.length === 0) return false;
            return (Number(cur) >= 0 && Number(cur) <= 255) ? true : false;
        }, true);
    };

    var getCurIPStr = function(cells) {
        var str = "";
        for(var i = 0; i < 4; ++i) {
            value = angular.element(cells[i]).val();
            str += (i === 0) ? value : "." + value;
        }
        return str;
    };

    var setCurIpStr = function(cells,value){
        var cellValues = value.split('.');
        for(var i=0;i<cellValues.length;i++){
            console.log(cells[i]);
            cells[i].value = cellValues[i];
        }
    };

    // function for text input cell
    var getCursorPosition = function() {
        var cell = this;
        if ('selectionStart' in cell) {
            // Standard-compliant browsers
            return cell.selectionStart;
        } else if (document.selection) {
            // IE
            cell.focus();
            var sel = document.selection.createRange();
            var selLen = document.selection.createRange().text.length;
            sel.moveStart('character', -cell.value.length);
            return sel.text.length - selLen;
        }
        throw new Error("cell is not an input");
    };

    // link function
    function link(scope, element, attrs) {
        var input = angular.element(element.find('div'));
        var cells = element.find('input');
        var prevValue = '';
        setCurIpStr(cells,scope.ipValue);
        scope.$watch(attrs.value, function(value) {
            scope[attrs.valid] = isValidIPStr(value); // set valid bool

            if (!isValidIPStr(value)) return;

            // set ip address
            value.split('.').forEach(function(str, index) {
                angular.element(cells[index]).val(str);
            });
        });

        cells.on('focus', function(event) {
            event.target.select();
            element.find('div').toggleClass('selected', true);
        });

        cells.on('focusout', function(event) {
            element.find('div').toggleClass('selected', false);
        });

        Array.prototype.forEach.call(cells, function(cell, index) {
            angular.element(cell).on('keydown', function(e) {
                if(e.keyCode >= 48 && e.keyCode <= 57 || e.keyCode >= 96 && e.keyCode <= 105) { // numbers
                    prevValue = scope.ipValue;
                } else if(e.keyCode == 37 || e.keyCode == 39) { //left key. right key
                    if (e.keyCode == 37 && getCursorPosition.call(cell) === 0) {
                        selectCell.call(input, index - 1);
                        e.preventDefault();
                    }
                    else if (e.keyCode == 39 && getCursorPosition.call(cell) === angular.element(cell).val().length) {
                        selectCell.call(input, index + 1);
                        e.preventDefault();
                    }
                } else if(e.keyCode == 9) { // allow tab
                } else if(e.keyCode == 8 || e.keyCode == 46) { // allow backspace, delete
                } else {
                    e.preventDefault();
                }
            });

            angular.element(cell).on('keyup', function(e) {
                // numbers
                if (e.keyCode >= 48 && e.keyCode <= 57 || e.keyCode >= 96 && e.keyCode <= 105) {
                    var val = angular.element(this).val();
                    var num = Number(val);
                    console.log(prevValue);
                    if (num > 255) {
                        revert(cells, prevValue);
                    } else if (val.length > 1 && val[0] === "0") {
                        revert(cells, prevValue);
                    } else if (val.length === 3) {
                        scope.ipValue = getCurIPStr(cells);
                        scope.$apply();
                        selectCell.call(input, index + 1)
                    } else {
                        scope.ipValue = getCurIPStr(cells);
                        scope.$apply();
                    }
                } else if (e.keyCode == 8 || e.keyCode == 46) {
                    scope.ipValue = getCurIPStr(cells);
                    scope.$apply();
                }
            });
        });
    }

    return {
        restrict: 'E',
        scope:{
            ipValue:"=",
            inputCss:"="
        },
        template:
        '<div class="ip-input" ng-class="inputCss">' +
        '<input type="text" class="ip-cell" />' +
        '<label class="ip-dot">.</label>' +
        '<input type="text" class="ip-cell" />' +
        '<label class="ip-dot">.</label>' +
        '<input type="text" class="ip-cell" />' +
        '<label class="ip-dot">.</label>' +
        '<input type="text" class="ip-cell" />' +
        '</div>',
        link: link
    };
});