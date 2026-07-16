State of California
Governor’s Office of Emergency Services
Chapter II- System Description

9-1-1 OPERATIONS MANUAL

  CHAPTER II -  SYSTEM DESCRIPTIONS

This chapter illustrates the three (3) separate and distinct "systems" that provide
the accessibility of "enhanced" 9-1-1 (E9-1-1) services in California.  (Reference to
"enhanced" indicates valuable 9-1-1 caller location information that
accompanies each call.)  The California 9-1-1 Emergency Communications
Branch (CA 9-1-1 Branch) is responsible for the administration and funding for
equipment and services related to the delivery of 9-1-1 calls in these three (3)
systems, that include: the "System One" (1): 9-1-1 Database; "System Two" (2):
the Network used for 911 services; and, "System Three" (3): the Public Safety
Answering Point (PSAP) CA 9-1-1 Customer Premise Equipment (CPE).

Successful processing of 9-1-1 calls in California is accomplished when all three
systems work together.  Below is a basic depiction of these three systems.

9-1-1 "THREE SYSTEM" DIAGRAM

Rev. 11-2022

1

  System Description

State of California
Governor’s Office of Emergency Services
Chapter II- System Description

SYSTEM DESCRIPTIONS

"SYSTEM" ONE (1):  9-1-1 DATABASE
The 9-1-1 Database is a system made up of two (2) separate elements, the
Automatic Location Identification (ALI) Database and the Database Management
System (DBMS).

1. The ALI Database is the repository that stores and provides address location

for each wireline telephone number in California. This information is
retrieved by the PSAP using the wireline subscriber telephone number to
help identify the physical location of the 9-1-1 caller.

2. The DBMS is the database engine that is used to manage and combine

adds, moves, and changes to the 9-1-1 database.

The DBMS also stores the Emergency Service Number (ESN) which associates
the unique telltales (law enforcement, fire, and medical emergency services)
combination for each wireline telephone number stored in the DBMS, based
on the physical address. The ESN correlates the proper telltales for routing a
9-1-1 call to the appropriate PSAP.

The DBMS receives updates and new phone service via "service order input"
and gateways that allow other telephone service providers (telcos) access
to the database. This information is mapped to a Master Street Address
Guide (MSAG) which determines the appropriate ESN by address range. The
MSAG is currently maintained by the 9-1-1 County Coordinators throughout
California. See Chapter VIII of this CA 9-1-1 County Coordinator Manual for
additional information about MSAG.

There are currently two incumbent 9-1-1 Database providers for wireline numbers
in California - AT&T and Verizon. Each provider stores information for their
respective franchise areas within California. The arrival of wireless providers and
Voice over Internet Protocol (VoIP) providers has added new 9-1-1 ALI storage
participants in California. These third party database providers have been
contracted by the various wireless and VoIP service providers to maintain their
respective customer ALI and ESN information. When ALI information is required
by a PSAP for these types of communications services, the two incumbent ALI
providers must "steer" the ALI query to the appropriate ALI storage participant
(see "steering" in "ALI Links To The ALI Database", pg. 11.4) to do a look-up based
on the Pseudo Automatic Number Identification (pANI) sent by the PSAP.

"SYSTEM" TWO (2):  CALIFORNIA 9-1-1 NETWORK
The California 9-1-1 Network provides an enhanced infrastructure to carry 9-1-1

Rev. 11-2022

2

  System Description

State of California
Governor’s Office of Emergency Services
Chapter II- System Description
calls from the 9-1-1 caller's location in the Public Switched Telephone Network
(PSTN) to the appropriate PSAP via wireline (landline), wireless, VoIP, and
Telematics Service Providers (TSP). This infrastructure includes the following
elements:

Landline 9-1-1 Network - The current landline 9-1-1 network is made up of 9-1-1 End
Offices to
9-1-1 Selective Router (S/R) trunks, one-way digital Signaling System Seven (SS?)
trunks that are dedicated to 9-1-1 traffic.  These trunks carry originating 9-1-1
calls from a wireline "dialtone" Central Office to the 9-1-1 S/R switch. These trunks
are engineered so that there is only one (1) busy signal per 100 attempts (P.01
grade of service).

9-1-1 Selective Router (S/R) - The current 9-1-1 S/Rs (sometimes referred to as 9-
1-1 tandems) in California are Lucent #5ESS and Nortel Digital Multiplex System
(OMS) 100. In addition to the usual dialtone and telephone features (such as
call waiting, 3-way calling, etc.) to telephone service subscribers, these switches
have been provisioned with specialized 9-1-1 software that provide features
such as: Automatic Number Identification (ANI); Manual Transfer; Selective
Transfer; and, Tandem-to-Tandem capability.

9-1-1 Selective Routing (S/R) -  S/R directs a 9-1-1 call to the appropriate PSAP
based on the
9-1-1 caller's location. This is done by associating the appropriate ESN (law
enforcement, fire, and medical emergency services) for each unique address
and telephone number. The following is a general description of the steps taken
to predetermine a caller's location:

a) Each law enforcement, fire, and emergency medical services
combination is assigned an Emergency Services Zone (ESZ).

b) These zones are then assigned a unique number, per S/R, called the

Emergency Services Number (ESN) and are assigned by address range
and telephone number in the MSAG.

c) Each PSAP is then assigned ESNs (by the Incumbent Local Exchange
Carrier (ILEC) for landline and CA 9-1-1 Branch for wireless) based on
their jurisdiction.

d) The ESN and the ANI or pANI associated with that ESN are then sent to the

S/R where they are stored in the S/R database and used to route 9-1-1 calls.

When a 9-1-1 call is sent to the S/R, the S/R queries the S/R database and
determines the ESN for that call. Once the ESN has been determined,  the 9-1-1
call is routed to the appropriate PSAP (based on ESN assignment) over 9-1-1

Enhanced Multi-Frequency  (MF) trunks as described below.

Rev. 11-2022

3

  System Description

State of California
Governor’s Office of Emergency Services
Chapter II- System Description

9-1-1 Enhanced Multi-Frequency (MF) PSAP Trunks - Enhanced MF trunks are in-
band signaling analog trunks that use Centralized Automatic Message
Accounting (CAMA) signaling protocol to out-pulse the 9-1-1 caller's ANI or
pANI to the PSAP. In the earlier years, 9-1-1 MF trunks were only capable of out-
pulsing eight (8) digit ANI to the PSAPs. These MF trunks have been "enhanced"
to provide 10-20 digit ANI information to the PSAP, therefore have been
designated as 9-1-1 Enhanced MF trunks.

SELECTIVE  ROUTING  CONFIGURATION

PSAP ALI Links To/From ALI Database - The ALI network is used to transport the
"basic" ANI, then enhanced, 9-1-1 caller information. After the 9-1-1 call is
directed to the appropriate PSAP via selective routing, the PSAP CPE directs the
ANI of the 9-1-1 caller to the 9-1-1 Database. The 9-1-1 Database performs an
ALI look-up, then returns the enhanced 9-1-1 caller ALI to the PSAP.

The two (2) incumbent ALI providers - AT&T and Verizon have configured
mirrored databases that provide ALI information to the PSAP by means of a
data link (with dial back-up) that queries both databases for redundancy to
support assurance of ALI service to the PSAP.  California has evolved with
keeping technologies  current. Originally the ALI links were X.25. They are now
digital 56K Frame Relay, and there are plans to upgrade to private Internet
Protocol (IP) in the future with
Next Generation (NG 9-1-1).

For wireless and VoIP ALI queries, the ALI database uses a "steering" network to
route the ALI query to the appropriate ALI database provider. This steering

Rev. 11-2022

4

  System Description

State of California
Governor’s Office of Emergency Services
Chapter II- System Description
network is made up of a steering table and a digital network to route the ALI
queries. The steering table is made up of pseudo-ANI (pANI) numbers which are
mapped to the various third party database providers. When a query for wireless
or VoIP ALI is made, the ALI database looks up the pANI in the steering table
using 211's for VoIP and 511's for Wireless, then determines the third party
database provider, and sends the query to the appropriate provider over the
steering network to retrieve the location of the 9-1-1 caller.

"SYSTEM" THREE (3):  PSAP 9-1-1 CUSTOMER PREMISE EQUIPMENT (CPE)
The third separate and distinct system that provides successful access to 9-1-1 in
California is the PSAP CPE. The CPE is made up of equipment that terminates the
9-1-1 call from the network and is presented to the call taker at the PSAP. The
CPE also includes the software and hardware required to provide the call taker
with ANI and ALI.

CPE equipment has evolved from key telephone systems with ANI/ALI controllers
to Intelligent Work Stations (IWS) consisting of computer workstations (monitors,
keyboards, arbitrators, and mouse) connected to back room servers that
collect and deliver the 9-1-1 call and location information to the 9-1-1 call taker.
The IWS presents the call taker with a Graphical User Interface (GUI) that
imitates telephone functionality. The GUI also provides a window that contains
ALI information. In addition, the GUI provides speed dial lists; a
Telecommunication Device for the Deaf/TeleTypewriter (TDD/TTY) interface; call
check recordings; and one-button transfer to fire and medical. Much of the GUI
configuration is CPE vendor dependent and usually can accommodate
features and functionality such as Computer Aided Dispatch (CAD), radio
interface, and Geographic Information System (GIS) mapping. Additional CPE
features such as Automatic Call Distribution (ACD), Management Information
System (MIS) and Records Management System (RMS) for call statistics and
records may also be included to support 9-1-1 call-taking at the PSAP
communications center.

The CA 9-1-1 Branch currently has a statewide contract for CPE providers that
can be used by the PSAPs to purchase CPE equipment. Please see Chapter Ill -
Funding of this Manual for funding policies and procedures.

MORE DETAILED INFORMATION ON THE CA 9-1-1 BRANCH WEBSITE

http://www.caloes.ca.gov/cal-oes-divisions/public-safety-
communications/ca-9-1-1-emergency- communications-branch/ca-9-1-1-
operations-manual

• Detailed overview of the three systems and how they work together -

Upon reaching the website, scroll down to "9-1-1 General Presentations"

Rev. 11-2022

5

  System Description

State of California
Governor’s Office of Emergency Services
Chapter II- System Description

heading and select "9-1-1 Call Flow Presentation (PowerPoint).

• CA 9-1-1 Comparison of Network Call Types - A "snapshot" document that
illustrates the 9-1-1 call flow for landline, private branch, wireless, VoIP,
Telematics, and Video/IP relay services. Upon reaching the website, select
"Publications" on the right side under 9-1-1 Services.  Scroll down on left side
to "Wireless, VoIP, and Next Generation E9-1-1 Publications", then select "CA
9-1-1 Comparison of Network Call Types.

• CPE Master Purchase Agreement -  See our website for information:

http://www.caloes.ca.gov/cal-oes-divisions/public-safety-
communications/ca-9-1-1-emergency- communications-branch/ca-9-1-1-
services-contracts

Rev. 11-2022

6

  System Description