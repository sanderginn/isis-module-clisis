\NeedsTeXFormat{LaTeX2e}
\ProvidesClass{uva-bachelor-thesis}[2005/06/10 Version 0.1 Rein van den Boomgaard]
\RequirePackage{graphicx}


\def\supervisors#1{\gdef\@supervisors{#1}}


\DeclareOption*{\PassOptionsToClass{\CurrentOption}{report}}
\ProcessOptions
\LoadClass[10pt]{report}

\usepackage[a4paper,scale={0.7,0.8},twoside]{geometry}

\usepackage[sf]{titlesec}
\titleformat{\chapter}[display]
{\cleardoublepage\sffamily\raggedleft
\titlerule\vspace{1pc}}
{\vspace{1ex}\Large \MakeUppercase{\chaptertitlename}\ \thechapter}
{3ex}
{\Huge}
[\vspace{1pc}\titlerule]

\usepackage[svgnames]{xcolor}
\usepackage[absolute,overlay]{textpos}
\usepackage{rotating}
\renewcommand{\maketitle}{%
	\thispagestyle{empty}
	\hspace*{1em} 	% a fake elment on the page (else texpos absolute option
			% doesn't work)
	\begin{textblock*}{10cm}(6cm,4cm)
		\noindent\large\scshape Bachelor Computer Science\\[2em]
		\includegraphics[height=1cm]{figures/uva}
		%\Large Universiteit van Amsterdam
	\end{textblock*}
	\begin{textblock*}{10cm}(6cm,12cm)
		\noindent
		\sffamily\Huge \@title\\[1pc]
		\Large \@author\\[3pc]
		\@date
	\end{textblock*}
	\begin{textblock*}{10cm}(6cm,25cm)
		\noindent\sffamily
		\begin{description}
		\item[\sffamily Supervisor(s):] \@supervisors
		\end{description}
	\end{textblock*}
	\textblockcolor{LightGray}
	\begin{textblock*}{2cm}(3.7cm,25cm)
		\begin{rotate}{90}
			\noindent\scshape\Huge\textcolor{Gray}{
				Informatica --- Universiteit van Amsterdam}
		\end{rotate}
	\end{textblock*}
	\begin{textblock*}{2cm}(3cm,2cm)
		\vspace*{26cm}\hspace*{1em}
	\end{textblock*}
	\cleardoublepage
}


\endinput

