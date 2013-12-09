#!/usr/bin/perl
use encoding 'utf8';
use feature 'unicode_strings';
print "list = {\n";
$toprint = "";
while($line = <STDIN>)
{
	# Separating the word and its pronunciation
	@_line = split(/\"/, $line);
	$orig = @_line[1];
	
	# nothing to do if the tonic syllabe is already clear (and there's no open vowel)
	next if ($orig =~ m/[áéíóúàèìòùâêîôû]/ and !($_line[2] =~ m/[EO]/));
	
	# foreign word, ignore
	next if ($orig =~ m/[kwy]/);
	
	
	### Working with the syllabes provided by the list ###
	$sil = @_line[2];
	$sil =~ s/\n//g;
	
	# I currently don't care about the function of the words
	$sil =~ s/^[^(]*//;
	
	# neither about the specific vowel pronunciation (besides the chiusura)
	$sil =~ s/E/ɛ/g;
	$sil =~ s/O/ɔ/g;
	$sil =~ s/([aeiouAEIOUɛɔ])[01]/\1/g;
	$sil =~ s/j/i/g;
	$sil =~ s/w/u/g;
	#print $sil;
	
	# Keep only the vowels and numbers
	# 0 = not tonic
	# 1 = tonic
	$sil =~ s/[() ]//g;
	$sil =~ s/[bcdfghjklmnpqrstvwxyz]//gi;
	
	# Use the numbers to separate the syllabes
	$sil =~ s/([01])/#\1 /g;
	
	# Gets a list of syllabes
	@_sil = split(" ", $sil);
	
	# nothing to do if there's only one syllabe
	next if(scalar(@_sil)<2);
	
	
	### Get the tonic syllabe inside () ###
	$i = 0;
	$wor = "";
	foreach(@_sil)
	{
		@_tmp = split("#", @_sil[$i]);
		if(@_tmp[1]=="1") {
			$wor = $wor . "(" . @_tmp[0] . ")";
		}
		else {
			$wor = $wor . @_tmp[0];
		}
		$i++;
	}
	
	
	### Get the num of vowels before and after the tonic syllabe ###
	@_wor = split(/[()]/, $wor);
	@_sil = split(//, $wor);
	$n1 = length(@_wor[0]);
	$n2 = length(@_wor[1]);
	$n3 = length(@_wor[2]);
	@_w = [];
	@_w[0] = split("", @_wor[0]);
	@_w[1] = split("", @_wor[1]);
	@_w[2] = split("", @_wor[2]);
	#print "[" . $wor . "]";
	#print "[" . @_sil . "]";
	#print "[" . @_w[0] . @_w[1] . @_w[2] . "]";
	
	
	#debug
	if($n1+$n2+$n3 != length($orig)) {
		#print STDERR $orig . " " . $wor . "\n";
	}
	
	$orig_1 = $orig;
	$orig =~ s/ci([oa])/#\1/g;
	$orig =~ s/gi([oa])/@\1/g;
	#print $orig;
	
	# Get the chars of the word
	# (I could make it all a single pretty loop, maybe another day...)
	@_orig = split("", $orig);
	$i = 0;
	$j = 0;
	$k = 0;
	$end1 = "";
	foreach(@_orig)
	{
		if($k >= $n1) {
			last;
		}
		if (@_orig[$i] =~ m/[aeiouáéíóúàèìòùâêîôûɛɔ]/) {
			$end1 = $end1 . @_sil[$k];
			#$end1 = $end1 . @_w[0][$k];
			$k++;
		}
		else {
			#print " #k:" . $k . " n1:" . $n1;
			$end1 = $end1 . @_orig[$i];
		}
		
		$i++;
		$j++;
	}
	
	$k = 0;
	$end2 = "";
	for(my $i = $j; $i <= length($orig); $i++)
	{
		if($k >= $n2) {
			last;
		}
		if (@_orig[$i] =~ m/[aeiouáéíóúàèìòùâêîôûɛɔ]/) {
			$end2 = $end2 . @_sil[$n1 + 1 + $k];
			#$end2 = $end2 . @_w[1][$k];
			$k++;
		}
		else {
			#print " #k:" . $k . " n2:" . $n2 . " [i]:" . @_orig[$i];
			$end2 = $end2 . @_orig[$i];
		}
		
		$j++;
	}
	
	$k = 0;
	$end3 = "";
	for(my $i = $j; $i <= length($orig); $i++)
	{
		if($k >= $n3) {
			last;
		}
		if (@_orig[$i] =~ m/[aeiouáéíóúàèìòùâêîôûɛɔ]/) {
			$end3 = $end3 . @_sil[$n1 + $n2 + 2 + $k];
			#$end3 = $end3 . @_w[2][$k];
			$k++;
		}
		else {
			#print " #k:" . $k . " n3:" . $n3 . " [i]:" . @_orig[$i];
			$end3 = $end3 . @_orig[$i];
		}
	}
	
	$end = $end1 . "(" . $end2 . ")" . $end3;
	
	
	# nothing to do if there's nothing in the tonic syllabe
	next if ($end =~ m/\(\)/);
	
	
	# fix some things
	#$end =~ s/\(([mn])([bcdfghjklmnpqrstvwxyz])/\1(\2/;
	#$end =~ s/\)([mn])([bcdfghjklmnpqrstvwxyz])/\1)\2/;
	$end =~ s/\(([bcdfghjklmnpqrstvwxyz])([bcdfghjklmnpqrstvwxyz])/\1(\2/g;
	$end =~ s/\)([bcdfghjklmnpqrstvwxyz])([bcdfghjklmnpqrstvwxyz])/\1)\2/g;
	$end =~ s/#/ci/g;
	$end =~ s/@/gi/g;
	
	# formatting for the javascript hash
	$end = "\"" . $orig_1 . "\":\"" . $end . "\"";
	
	# Print the one from the previous iteration
	if(!($toprint eq "") and !($toprint eq $end)) {
		#print "\"" . $toprint . "\",\n";
		print $toprint . ",\n";
	}
	
	# And sets this one as the next
	$toprint = $end;
}
if(!($toprint eq "")) {
	#print "\"" . $toprint . "\"];\n";
	print $toprint . "};\n";
}

